import { Router } from "express";
import * as squadsController from "./squads.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";
import { controllerWrapper } from "../application/utils/controller-wrapper";
import { isAdmin } from "../application/middlewares/isAdmin";
import validator from "../application/middlewares/validation.middleware";
import { squadsCreateSchema, squadsUpdateSchema } from "./squads.schema";

const squadRouter = Router();

squadRouter.get(
  "/",
  authenticateToken,
  controllerWrapper(squadsController.getSquads)
);
squadRouter.get(
  "/:id",
  authenticateToken,
  controllerWrapper(squadsController.getSquadById)
);
squadRouter.post(
  "/",
  authenticateToken,
  isAdmin,
  validator.body(squadsCreateSchema),
  controllerWrapper(squadsController.postSquad)
);
squadRouter.patch(
  "/:id",
  authenticateToken,
  isAdmin,
  validator.body(squadsUpdateSchema),
  controllerWrapper(squadsController.updateSquad)
);
squadRouter.patch(
  "/:squadId/armies/:armyId",
  authenticateToken,
  isAdmin,
  controllerWrapper(squadsController.assignSquadToArmy)
);
squadRouter.patch(
  "/:id/remove_army",
  authenticateToken,
  isAdmin,
  controllerWrapper(squadsController.removeSquadFromArmy)
);
squadRouter.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  controllerWrapper(squadsController.deleteSquad)
);

export default squadRouter;
