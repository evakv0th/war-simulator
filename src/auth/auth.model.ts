import { User } from "./types/auth.interfaces";

let idForCounter = 1;
export function getNextId() {
  return idForCounter++;
}

export const users: User[] = [
  {
    id: getNextId(),
    username: "test",
    password: "test",
    type: "normal",
    email: "gma@gmail.com"
  },
  {
    id: getNextId(),
    username: "admin",
    password: "test",
    type: "admin",
    email: "admin@gmail.com"
  },
];
