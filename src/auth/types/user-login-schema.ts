import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import { User } from './auth.interfaces';


export interface UserRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<User, 'id' & 'type'>;
}
