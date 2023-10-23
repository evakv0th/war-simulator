import * as usersService from './users.service';
import { Request, Response } from "express";


export async function getUsers(req: Request, res: Response) {
    try {
        const name: string | undefined = req.query.name as string;
        console.log(name, ' name in user controller')
        const users = await usersService.getUsers({ name });

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }