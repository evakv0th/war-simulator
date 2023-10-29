import Joi from 'joi';
import { PlanesCreateSchema } from './types/planes.interfaces';


export const planesCreateSchema = Joi.object<PlanesCreateSchema>({
  name: Joi.string().required().min(3).max(100),
  air_strength: Joi.number().required().min(0).max(400),
  surface_strength: Joi.number().required().min(0).max(100),
  fuel_req: Joi.number().required().min(0).max(400),
});

export const planesUpdateSchema = Joi.object<Partial<PlanesCreateSchema>>({
  name: Joi.string().optional().min(3).max(100),
  air_strength: Joi.number().optional().min(0).max(400),
  surface_strength: Joi.number().optional().min(0).max(100),
  fuel_req: Joi.number().optional().min(0).max(400),
});
