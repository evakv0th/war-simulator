import { Router } from "express";
import * as armiesController from "./armies.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";
import { controllerWrapper } from "../application/utils/controller-wrapper";
import { isAdmin } from "../application/middlewares/isAdmin";
import validator from "../application/middlewares/validation.middleware";
import { armiesCreateSchema, armiesUpdateSchema } from "./armies.schema";

const armyRouter = Router();

armyRouter.get(
  "/",
  authenticateToken,
  controllerWrapper(armiesController.getArmies)
);
armyRouter.get(
  "/:id",
  authenticateToken,
  controllerWrapper(armiesController.getArmyById)
);
armyRouter.post(
  "/",
  authenticateToken,
  isAdmin,
  validator.body(armiesCreateSchema),
  controllerWrapper(armiesController.postArmy)
);
armyRouter.patch(
  "/:id",
  authenticateToken,
  isAdmin,
  validator.body(armiesUpdateSchema),
  controllerWrapper(armiesController.updateArmy)
);
armyRouter.patch(
  "/:armyId/users/:userId",
  authenticateToken,
  isAdmin,
  controllerWrapper(armiesController.assignArmyToUser)
);
armyRouter.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  controllerWrapper(armiesController.deleteArmy)
);

export default armyRouter;
