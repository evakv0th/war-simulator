import Joi from 'joi';
import { TanksCreateSchema} from './types/tanks.interfaces';


export const tanksCreateSchema = Joi.object<TanksCreateSchema>({
  name: Joi.string().required().min(3).max(100),
  strength: Joi.number().required().min(0).max(300),
  fuel_req: Joi.number().required().min(0).max(400),
});

export const tanksUpdateSchema = Joi.object<Partial<TanksCreateSchema>>({
  name: Joi.string().optional().min(3).max(100),
  strength: Joi.number().optional().min(0).max(300),
  fuel_req: Joi.number().optional().min(0).max(400),
});
