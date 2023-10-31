import { Response } from "express";
import { generateToken } from "./auth.tokenGenerate";
import { User } from "./types/auth.interfaces";
import { ValidatedRequest } from "express-joi-validation";
import { UserRequest } from "./types/user-login-schema";
import { AuthenticatedRequest } from "../application/middlewares/authenticateToken";
import pool from "../db";

export async function login(req: ValidatedRequest<UserRequest>, res: Response) {
  const { name, password, email } = req.body;
  try {
    const client = await pool.connect();

    try {
      const query = {
        text: "SELECT * FROM users WHERE name = $1 AND password = $2 AND email = $3",
        values: [name, password, email],
      };

      const result = await client.query(query);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const token = generateToken(user);
        res.json({ token });
      } else {
        res.status(401).send("Wrong username, password, or email");
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).send("Internal Server Error");
  }
}

export async function register(
  req: ValidatedRequest<UserRequest>,
  res: Response
) {
  const { name, password, email, type } = req.body;

  try {
    const client = await pool.connect();

    try {
      const checkUserQuery = {
        text: "SELECT id FROM users WHERE name = $1 OR email = $2",
        values: [name, email],
      };

      const checkResult = await client.query(checkUserQuery);

      if (checkResult.rows.length > 0) {
        return res
          .status(400)
          .send("User with the same name or email already exists.");
      }

      const query = {
        text: "INSERT INTO users (name, password, email, type) VALUES ($1, $2, $3, $4) RETURNING *",
        values: [name, password, email, type],
      };

      const result = await client.query(query);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        res.status(201).json(user);
      } else {
        res.status(500).send("User registration failed.");
      }
    } finally {
      client.release();
    } 
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).send("Internal Server Error");
  }
}

export function protectedRoute(req: AuthenticatedRequest, res: Response) {
  res.send("Access Granted");
}
