import "reflect-metadata";
import User from '../infra/typeorm/entities/User';
// import path from 'path';
// import uploadCofig from '@config/upload';

import { injectable, inject } from 'tsyringe';

import IUserRepository from '../repositories/IUserRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
// import fs from 'fs';
import AppError from '@shared/errors/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}
@injectable()
class UpdateUserAvatarService{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,


    ){}

    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('Only authnticated users can change avatar',401);
    }

    if(user.avatar) {
      // Deletar avatar anterior
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFilename)

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;

  }
}

export default UpdateUserAvatarService;
