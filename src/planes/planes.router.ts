import { Router } from "express";
import * as planesController from "./planes.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";
import { controllerWrapper } from "../application/utils/controller-wrapper";
import { isAdmin } from "../application/middlewares/isAdmin";
import validator from "../application/middlewares/validation.middleware";
import { planesCreateSchema, planesUpdateSchema } from "./planes.schema";

const planeRouter = Router();

planeRouter.get(
  "/",
  authenticateToken,
  controllerWrapper(planesController.getPlanes)
);
planeRouter.get(
  "/:id",
  authenticateToken,
  controllerWrapper(planesController.getPlaneById)
);
planeRouter.post(
  "/",
  authenticateToken,
  isAdmin,
  validator.body(planesCreateSchema),
  controllerWrapper(planesController.postPlane)
);
planeRouter.patch(
  "/:id",
  authenticateToken,
  isAdmin,
  validator.body(planesUpdateSchema),
  controllerWrapper(planesController.updatePlane)
);
planeRouter.patch(
  "/:planeId/armies/:armyId",
  authenticateToken,
  isAdmin,
  controllerWrapper(planesController.assignPlaneToArmy)
);
planeRouter.patch(
  "/:id/remove_army",
  authenticateToken,
  isAdmin,
  controllerWrapper(planesController.removePlaneFromArmy)
);
planeRouter.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  controllerWrapper(planesController.deletePlane)
);

export default planeRouter;
