import dotenv from "dotenv";
import crypto from "crypto";
import { User } from "./types/auth.interfaces";

dotenv.config();
export const sKey: any = process.env.SECRET_KEY;

export function generateToken(user: User): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64");
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, username: user.username })
  ).toString("base64");

  const signature = crypto
    .createHmac("sha256", sKey)
    .update(`${header}.${payload}`)
    .digest("base64");

  return `${header}.${payload}.${signature}`;
}