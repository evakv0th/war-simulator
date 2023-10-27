import dotenv from "dotenv";
import { User } from "./types/auth.interfaces";
import { sha256 } from "./auth.sha256";

dotenv.config();
export const sKey: any = process.env.SECRET_KEY;

export function generateToken(user: User): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64");
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, username: user.name })
  ).toString("base64");

  console.log(header);
  console.log(payload);
  const signatureManual = sha256(header + payload + sKey);
  console.log(signatureManual);

  return `${header}.${payload}.${signatureManual}`;
}
