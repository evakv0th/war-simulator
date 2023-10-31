import Joi from 'joi';
import { ArmiesCreateSchema } from './types/armies.interfaces';


const validAdvantageValues = ['air', 'heavy_tech', 'minefield', 'patriotic'];

export const armiesCreateSchema = Joi.object<ArmiesCreateSchema>({
  name: Joi.string().required().min(3).max(30),
  advantage: Joi.string().valid(...validAdvantageValues).required().min(3).max(30),
  fuel_amount: Joi.number().required().min(1).max(1000),
  bullets_amount: Joi.number().required().min(1).max(1000),
});

export const armiesUpdateSchema = Joi.object<Partial<ArmiesCreateSchema>>({
    name: Joi.string().optional().min(3).max(30),
    advantage: Joi.string().valid(...validAdvantageValues).optional().min(3).max(30),
    fuel_amount: Joi.number().optional().min(1).max(1000),
    bullets_amount: Joi.number().optional().min(1).max(1000),
});
