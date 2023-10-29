import { Router } from "express";
import * as tanksController from "./tanks.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";
import { controllerWrapper } from "../application/utils/controller-wrapper";
import { isAdmin } from "../application/middlewares/isAdmin";
import validator from "../application/middlewares/validation.middleware";
import { tanksCreateSchema, tanksUpdateSchema } from "./tanks.schema";

const tankRouter = Router();

tankRouter.get(
  "/",
  authenticateToken,
  controllerWrapper(tanksController.getTanks)
);
tankRouter.get(
  "/:id",
  authenticateToken,
  controllerWrapper(tanksController.getTankById)
);
tankRouter.post(
  "/",
  authenticateToken,
  isAdmin,
  validator.body(tanksCreateSchema),
  controllerWrapper(tanksController.postTank)
);
tankRouter.patch(
  "/:id",
  authenticateToken,
  isAdmin,
  validator.body(tanksUpdateSchema),
  controllerWrapper(tanksController.updateTank)
);
tankRouter.patch(
  "/:tankId/armies/:armyId",
  authenticateToken,
  isAdmin,
  controllerWrapper(tanksController.assignTankToArmy)
);
tankRouter.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  controllerWrapper(tanksController.deleteTank)
);

export default tankRouter;
