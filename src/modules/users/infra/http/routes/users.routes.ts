import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersControle from '../Controllers/UsersController'
import UserAvatarController from '../Controllers/UserAvatarController'

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

const usersControle = new UsersControle();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', usersControle.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update
);

export default usersRouter;
