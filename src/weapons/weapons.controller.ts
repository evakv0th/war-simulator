import { ValidatedRequest } from "express-joi-validation";
import HttpStatusCode from "../application/exceptions/statusCode";
import * as weaponsService from "./weapons.service";
import { Request, Response } from "express";
import HttpException from "../application/exceptions/http-exceptions";
import { WeaponRequest } from "./types/weapons.interfaces";

export async function getWeapons(req: Request, res: Response) {
  try {
    const weapon = await weaponsService.getWeapons();
    res.json(weapon);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function getWeaponById(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    const weapon = await weaponsService.getWeaponById(id);

    res.json(weapon);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function postWeapon(
  req: ValidatedRequest<WeaponRequest>,
  res: Response
) {
  try {
    const weapon = await weaponsService.postWeapon(req.body);

    res.status(HttpStatusCode.CREATED).json(weapon);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function updateWeapon(
  req: ValidatedRequest<WeaponRequest>,
  res: Response
) {
  try {
    const { id } = req.params;
    const weapon = await weaponsService.updateWeapon(id, req.body);
    res.json(weapon);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function deleteWeapon(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    const weapon = await weaponsService.deleteWeapon(id);

    res.status(HttpStatusCode.NO_CONTENT).json(weapon);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function assignWeaponToSquad(
  req: Request<{ weaponId: string; squadId: string }>,
  res: Response
) {
  try {
    const { weaponId, squadId } = req.params;
    const weapon = await weaponsService.assignWeaponToSquad(weaponId, squadId);
    res.json(weapon);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
