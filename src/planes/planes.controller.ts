import { ValidatedRequest } from "express-joi-validation";
import HttpStatusCode from "../application/exceptions/statusCode";
import * as planesService from "./planes.service";
import { Request, Response } from "express";
import HttpException from "../application/exceptions/http-exceptions";
import { PlaneRequest } from "./types/planes.interfaces";

export async function getPlanes(req: Request, res: Response) {
  try {
    const planes = await planesService.getPlanes();
    res.json(planes);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function getPlaneById(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    const plane = await planesService.getPlaneById(id);

    res.json(plane);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function postPlane(
  req: ValidatedRequest<PlaneRequest>,
  res: Response
) {
  try {
    const plane = await planesService.postPlane(req.body);

    res.status(HttpStatusCode.CREATED).json(plane);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function updatePlane(
  req: ValidatedRequest<PlaneRequest>,
  res: Response
) {
  try {
    const { id } = req.params;
    const plane = await planesService.updatePlane(id, req.body);
    res.json(plane);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function deletePlane(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const plane = await planesService.deletePlane(id);

    res.status(HttpStatusCode.NO_CONTENT).json(plane);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function assignPlaneToArmy(
  req: Request<{ planeId: string; armyId: string }>,
  res: Response
) {
  try {
    const { planeId, armyId } = req.params;
    const plane = await planesService.assignPlaneToArmy(planeId, armyId);
    res.json(plane);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function removePlaneFromArmy(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    const plane = await planesService.removePlaneFromArmy(id);
    res.json(plane);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
