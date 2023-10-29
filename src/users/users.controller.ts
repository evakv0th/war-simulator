import { ValidatedRequest } from 'express-joi-validation';
import HttpStatusCode from '../application/exceptions/statusCode';
import * as usersService from './users.service';
import { Request, Response } from "express";
import { UserRequest } from '../auth/types/user-login-schema';
import HttpException from '../application/exceptions/http-exceptions';


export async function getUsers(req: Request, res: Response) {
    try {
        const name: string | undefined = req.query.name as string;
        console.log(name, ' name in user controller')
        const users = await usersService.getUsers({ name });

        res.json(users);
    } catch (err) {
        if (err instanceof HttpException) {
            res.status(err.status).json({ error: err.message });
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
  }

  export async function getUserById(req: Request<{ id: string }>, res: Response) {
    try {
        const { id } = req.params;
        const user = await usersService.getUserById(id);

        res.json(user);
    } catch (err) {
        if (err instanceof HttpException) {
            res.status(err.status).json({ error: err.message });
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
  }

  export async function updateUser(req: ValidatedRequest<UserRequest>, res: Response) {
    try {
        const { id } = req.params;
        const user = await usersService.updateUser(id, req.body);
        res.json(user);
    } catch (err) {
        if (err instanceof HttpException) {
            res.status(err.status).json({ error: err.message });
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
  }



  export async function deleteUser(req: Request<{ id: string }>, res: Response) {
    try {
        const { id } = req.params;
        const user = await usersService.deleteUser(id);

        res.status(HttpStatusCode.NO_CONTENT).json(user);
    } catch (err) {
        if (err instanceof HttpException) {
            res.status(err.status).json({ error: err.message });
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
  }