import { Router } from 'express';

import ForgotPasswordController from '../Controllers/SessionsController';
import ResetPasswordController from '../Controllers/SessionsController';


const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();


passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;
