import express from "express";
import { login, register, protectedRoute } from "./auth.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";
import { isAdmin } from "../application/middlewares/isAdmin";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/protected", authenticateToken, isAdmin, protectedRoute);

export default authRouter;
