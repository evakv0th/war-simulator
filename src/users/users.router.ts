import { Router } from "express";
import * as usersController from "./users.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";
import { controllerWrapper } from "../application/utils/controller-wrapper";
import { isAdmin } from "../application/middlewares/isAdmin";
import validator from "../application/middlewares/validation.middleware";
import { usersUpdateSchema } from "./users.schema";

const userRouter = Router();

userRouter.get(
  "/",
  authenticateToken,
  controllerWrapper(usersController.getUsers)
);
userRouter.get(
  "/:id",
  authenticateToken,
  controllerWrapper(usersController.getUserById)
);
userRouter.get(
  "/battle/:enemyId",
  authenticateToken,
  controllerWrapper(usersController.battle)
);
userRouter.get(
  "/battle/:enemyId/airBattle",
  authenticateToken,
  controllerWrapper(usersController.airBattle)
);
userRouter.get(
  "/battle/:enemyId/surfaceBattle",
  authenticateToken,
  controllerWrapper(usersController.surfaceBattle)
);
userRouter.patch(
  "/:id",
  authenticateToken,
  isAdmin,
  validator.body(usersUpdateSchema),
  controllerWrapper(usersController.updateUser)
);
userRouter.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  controllerWrapper(usersController.deleteUser)
);

export default userRouter;
