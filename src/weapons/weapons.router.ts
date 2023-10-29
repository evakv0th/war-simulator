import { Router } from "express";
import * as weaponsController from "./weapons.controller";
import { authenticateToken } from "../application/middlewares/authenticateToken";
import { controllerWrapper } from "../application/utils/controller-wrapper";
import { isAdmin } from "../application/middlewares/isAdmin";
import validator from "../application/middlewares/validation.middleware";
import { weaponsCreateSchema, weaponsUpdateSchema } from "./weapons.schema";

const weaponRouter = Router();

weaponRouter.get(
  "/",
  authenticateToken,
  controllerWrapper(weaponsController.getWeapons)
);
weaponRouter.get(
  "/:id",
  authenticateToken,
  controllerWrapper(weaponsController.getWeaponById)
);
weaponRouter.post(
  "/",
  authenticateToken,
  isAdmin,
  validator.body(weaponsCreateSchema),
  controllerWrapper(weaponsController.postWeapon)
);
weaponRouter.patch(
  "/:id",
  authenticateToken,
  isAdmin,
  validator.body(weaponsUpdateSchema),
  controllerWrapper(weaponsController.updateWeapon)
);
weaponRouter.patch(
  "/:weaponId/Squad/:squadId",
  authenticateToken,
  isAdmin,
  controllerWrapper(weaponsController.assignWeaponToSquad)
);
weaponRouter.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  controllerWrapper(weaponsController.deleteWeapon)
);

export default weaponRouter;
