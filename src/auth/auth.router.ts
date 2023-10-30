import express from "express";
import { login, register, protectedRoute } from "./auth.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";
import { isAdmin } from "../application/middlewares/isAdmin";
import { controllerWrapper } from "../application/utils/controller-wrapper";
import validator from "../application/middlewares/validation.middleware";
import { usersCreateSchema } from "../users/users.schema";

const authRouter = express.Router();

authRouter.post("/login", controllerWrapper(login));
authRouter.post("/register",  validator.body(usersCreateSchema), controllerWrapper(register));
authRouter.get("/protected", authenticateToken, isAdmin, controllerWrapper(protectedRoute));

export default authRouter;
