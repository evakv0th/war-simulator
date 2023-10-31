import Joi from "joi";
import { UserCreateSchema } from "../auth/types/auth.interfaces";

const validAdvantageValues = ["user", "admin"];

export const usersCreateSchema = Joi.object<UserCreateSchema>({
  name: Joi.string().required().min(3).max(100),
  password: Joi.string().required().min(3).max(100),
  email: Joi.string().required().min(3).max(100),
  type: Joi.string()
    .valid(...validAdvantageValues)
    .required(),
});

export const usersUpdateSchema = Joi.object<Partial<UserCreateSchema>>({
  name: Joi.string().optional().min(3).max(100),
  password: Joi.string().optional().min(3).max(100),
  email: Joi.string().optional().min(3).max(100),
  type: Joi.string()
    .valid(...validAdvantageValues)
    .optional(),
});
