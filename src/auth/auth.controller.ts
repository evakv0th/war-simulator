import { Response } from "express";
import { generateToken } from "./auth.tokenGenerate";
import { getNextId, users } from "./auth.model";
import { User } from "./types/auth.interfaces";
import { ValidatedRequest } from "express-joi-validation";
import { UserRequest } from "./types/user-login-schema";
import { AuthenticatedRequest } from "../application/middlewares/authenticateToken";

export function login(req: ValidatedRequest<UserRequest>, res: Response) {
  const { username, password, email } = req.body;
  const user = users.find(
    (user: User) =>
      user.username === username &&
      user.password === password &&
      user.email === email
  );
  if (user) {
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).send("Wrong name, pass or email");
  }
}

export function register(req: ValidatedRequest<UserRequest>, res: Response) {
  const { username, password, email } = req.body;
  if (username && password && email) {
    const user: User = {
      id: getNextId(),
      username: username,
      password: password,
      type: "normal",
      email: email,
    };
    users.push(user);
    res.status(201).json(user);
  } else {
    res.status(400).send("Bad Request");
  }
}

export function protectedRoute(req: AuthenticatedRequest, res: Response) {
  res.send("Access Granted");
}
