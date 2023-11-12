import { ValidatedRequest } from 'express-joi-validation';
import HttpStatusCode from '../application/exceptions/statusCode';
import * as usersService from './users.service';
import { Request, Response } from 'express';
import { UserRequest } from '../auth/types/user-login-schema';
import HttpException from '../application/exceptions/http-exceptions';
import { User } from '../auth/types/auth.interfaces';

export type AuthenticatedRequest<T> = Request & { user: User };

export async function getUsers(req: Request, res: Response) {
  try {
    const name: string | undefined = req.query.name as string;
    console.log(name, ' name in user controller');
    const users = await usersService.getUsers({ name });
    console.log(users, 'users in user controller');

    res.json(users);
  } catch (err) {
    console.log(err);
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

export async function updateUser(
  req: ValidatedRequest<UserRequest>,
  res: Response,
) {
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

export async function battle(
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.user.id.toString();
    const enemyId = req.params.enemyId;
    const match = await usersService.battle(id, enemyId);
    res.json(match);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function airBattle(
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.user.id.toString();
    const enemyId = req.params.enemyId;
    const match = await usersService.airBattle(id, enemyId);
    res.json(match);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function surfaceBattle(
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.user.id.toString();
    const enemyId = req.params.enemyId;
    const match = await usersService.surfaceBattle(id, enemyId);
    res.json(match);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
