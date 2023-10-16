import express from "express";
import { login, register, protectedRoute } from "./auth.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/protected", authenticateToken, protectedRoute);

export default authRouter;
