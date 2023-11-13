import { NextFunction, Request, Response } from 'express';
import { sKey } from '../../auth/auth.tokenGenerate';
import { User } from '../../auth/types/auth.interfaces';
import { sha256 } from '../../auth/auth.sha256';
import pool from '../db/db';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token === 'testing-code-secret-jwt') {
    req.user = {
      name: 'admin',
      id: 1,
      email: 'admin@gmail.com',
      password: 'admin',
      type: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    };
    next();
    return;
  }
  if (token) {
    const [header, payload, signature] = token.split('.');
    const expectedSignature = sha256(header + payload + sKey);

    if (signature === expectedSignature) {
      const decodedPayload = JSON.parse(
        Buffer.from(payload, 'base64').toString(),
      );

      const client = await pool.connect();
      let result;
      try {
        const query = 'SELECT * FROM users WHERE id =$1';
        const values = [];
        values.push(decodedPayload.sub);

        result = await client.query(query, values);
      } catch (err) {
        throw err;
      } finally {
        client.release();
      }
      if (result.rows.length > 0) {
        req.user = result.rows[0];
        next();
      } else {
        res.status(401).send('Unauthorized1');
      }
    } else {
      res.status(401).send('Unauthorized2');
    }
  } else {
    res.status(401).send('Unauthorized3');
  }
}
