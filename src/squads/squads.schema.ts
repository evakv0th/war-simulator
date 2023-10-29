import Joi from "joi";
import { SquadsCreateSchema } from "./types/squads.interfaces";

export const squadsCreateSchema = Joi.object<SquadsCreateSchema>({
  name: Joi.string().required().min(3).max(100),
});

export const squadsUpdateSchema = Joi.object<Partial<SquadsCreateSchema>>({
  name: Joi.string().optional().min(3).max(100),
});
