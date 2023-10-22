import { NextFunction, Request, Response } from "express";
import { sKey } from "../../auth/auth.tokenGenerate";
import { users } from "../../auth/auth.model";
import { User } from "../../auth/types/auth.interfaces";
import { sha256 } from "../../auth/auth.sha256";
import pool from "../../db";


export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      const [header, payload, signature] = token.split(".");
      const expectedSignature = sha256(header + payload + sKey);
      console.log(expectedSignature)
      console.log(signature)

      if (signature === expectedSignature) {
        const decodedPayload = JSON.parse(Buffer.from(payload, "base64").toString());
  
        const user = users.find((user) => user.id === decodedPayload.sub);
  
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).send("Unauthorized");
        }
      } else {
        res.status(401).send("Unauthorized");
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  }