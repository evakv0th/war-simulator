import Joi from "joi";
import { WeaponsCreateSchema } from "./types/weapons.interfaces";

export const weaponsCreateSchema = Joi.object<WeaponsCreateSchema>({
  name: Joi.string().required().min(3).max(100),
  strength: Joi.number().required().min(0).max(200),
  bullets_req: Joi.number().required().min(0).max(300)
});

export const weaponsUpdateSchema = Joi.object<Partial<WeaponsCreateSchema>>({
  name: Joi.string().optional().min(3).max(100),
  strength: Joi.number().optional().min(0).max(200),
  bullets_req: Joi.number().optional().min(0).max(300)
});
