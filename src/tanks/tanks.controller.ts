import { ValidatedRequest } from "express-joi-validation";
import HttpStatusCode from "../application/exceptions/statusCode";
import * as tanksService from "./tanks.service";
import { Request, Response } from "express";
import HttpException from "../application/exceptions/http-exceptions";
import { TankRequest } from "./types/tanks.interfaces";

export async function getTanks(req: Request, res: Response) {
  try {
    const tanks = await tanksService.getTanks();
    res.json(tanks);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function getTankById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const tank = await tanksService.getTankById(id);

    res.json(tank);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function postTank(
  req: ValidatedRequest<TankRequest>,
  res: Response
) {
  try {
    const tank = await tanksService.postTank(req.body);

    res.status(HttpStatusCode.CREATED).json(tank);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function updateTank(
  req: ValidatedRequest<TankRequest>,
  res: Response
) {
  try {
    const { id } = req.params;
    const tank = await tanksService.updateTank(id, req.body);
    res.json(tank);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}


export async function deleteTank(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const tank = await tanksService.deleteTank(id);

    res.status(HttpStatusCode.NO_CONTENT).json(tank);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}


export async function assignTankToArmy(
  req: Request<{ tankId: string; armyId: string }>,
  res: Response
) {
  try {
    const { tankId, armyId } = req.params;
    const tank = await tanksService.assignTankToArmy(tankId, armyId);
    res.json(tank);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function removeTankFromArmy(
  req: Request<{ id: string}>,
  res: Response
) {
  try {
    const { id } = req.params;
    const tank = await tanksService.removeTankFromArmy(id);
    res.json(tank);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}