import { ValidatedRequest } from "express-joi-validation";
import HttpStatusCode from "../application/exceptions/statusCode";
import * as armiesService from "./armies.service";
import { Request, Response } from "express";
import HttpException from "../application/exceptions/http-exceptions";
import { ArmyRequest } from "./types/armies.interfaces";

export async function getArmies(req: Request, res: Response) {
  try {
    const armies = await armiesService.getArmies();
    res.json(armies);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function getArmyById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const army = await armiesService.getArmyById(id);

    res.json(army);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function postArmy(
  req: ValidatedRequest<ArmyRequest>,
  res: Response
) {
  try {
    const { id } = req.params;
    const army = await armiesService.postArmy(req.body);

    res.status(HttpStatusCode.CREATED).json(army);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function updateArmy(
  req: ValidatedRequest<ArmyRequest>,
  res: Response
) {
  try {
    const { id } = req.params;
    const army = await armiesService.updateArmy(id, req.body);
    res.json(army);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function assignArmyToUser(
  req: Request<{ armyId: string; userId: string }>,
  res: Response
) {
  try {
    const { armyId, userId } = req.params;
    const army = await armiesService.assignArmyToUser(armyId, userId);
    res.json(army);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function deleteArmy(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const army = await armiesService.deleteArmy(id);

    res.status(HttpStatusCode.NO_CONTENT).json(army);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
