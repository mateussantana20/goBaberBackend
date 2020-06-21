import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvata: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvata = new UpdateUserAvatarService(
     fakeUsersRepository,
     fakeStorageProvider
   );
  })

  it('should be able to create a new user', async () => {
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
    await expect(updateUserAvata.execute({
      user_id: 'non-existing-user',
      avatarFilename: 'avata.jpg',
    })).rejects.toBeInstanceOf(AppError);
  });



  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
