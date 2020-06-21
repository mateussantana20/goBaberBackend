import User from '../infra/typeorm/entities/User';
import { sign } from 'jsonwebtoken';

import { injectable,inject} from 'tsyringe';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';


import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface Request{
  email:string;
  password: string;
}

interface Response {
  user: User;
  token: string
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
    ){}

    public async execute({ email, password }: Request): Promise<Response>{

    const user = await this.usersRepository.findByEmail(email);

    if(!user) {
      throw new AppError('Incorrect email/password combination.',401);
    }

    //user.password - Senha criptografada
    //passwrod - Senha não critografada

    const passwordMatched = await this.hashProvider.compareHash(password,user.password);

    if(!passwordMatched){
      throw new AppError('Incorrect email/password combination.',401);
    }
    //Usuario autenticado

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }

}

export default AuthenticateUserService;
