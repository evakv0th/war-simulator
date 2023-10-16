import Joi from "joi";
import { User } from "./types/auth.interfaces";

export const userLoginSchema = Joi.object<Omit<User, 'id' & 'type'>>({
    username: Joi.string().required().min(3).max(100),
    password: Joi.string().required().min(3).max(100),
    email: Joi.string().required().min(3).max(100)
})
