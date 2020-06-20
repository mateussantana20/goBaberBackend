import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';


describe('UpdateUserAvatar', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvata = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'Johan Doe',
      email:'johndDoe@example.com',
      password: '123456'
    })
      await updateUserAvata.execute({
        user_id: user.id,
        avatarFilename: 'avata.jpg',
      });

      expect(user.avatar).toBe('avata.jpg')
  });


  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvata = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'Johan Doe',
      email:'johndDoe@example.com',
      password: '123456'
    })


      expect(updateUserAvata.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avata.jpg',
      })).rejects.toBeInstanceOf(AppError);
  });



  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvata = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'Johan Doe',
      email:'johndDoe@example.com',
      password: '123456'
    })
      await updateUserAvata.execute({
        user_id: user.id,
        avatarFilename: 'avata.jpg',
      });

      await updateUserAvata.execute({
        user_id: user.id,
        avatarFilename: 'avata2.jpg',
      });

      expect(deleteFile).toHaveBeenCalledWith('avata.jpg');

      expect(user.avatar).toBe('avata2.jpg')
  });

});
