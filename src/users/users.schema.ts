import Joi from 'joi';
import { UserCreateSchema } from '../auth/types/auth.interfaces';


export const usersCreateSchema = Joi.object<UserCreateSchema>({
  name: Joi.string().required().min(3).max(100),
  password: Joi.string().required().min(3).max(100),
  email: Joi.string().required().min(3).max(100),
});

export const usersUpdateSchema = Joi.object<Partial<UserCreateSchema>>({
    name: Joi.string().optional().min(3).max(100),
    password: Joi.string().optional().min(3).max(100),
    email: Joi.string().optional().min(3).max(100),
});
