import { Router } from 'express';
import * as usersController from './users.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';
import { controllerWrapper } from '../application/utils/controller-wrapper';

const userRouter = Router();

userRouter.get('/', authenticateToken, controllerWrapper(usersController.getUsers) )

export default userRouter;