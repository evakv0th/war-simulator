import { ValidatedRequest } from "express-joi-validation";
import HttpStatusCode from "../application/exceptions/statusCode";
import * as squadsService from "./squads.service";
import { Request, Response } from "express";
import HttpException from "../application/exceptions/http-exceptions";
import { SquadRequest } from "./types/squads.interfaces";

export async function getSquads(req: Request, res: Response) {
  try {
    const squads = await squadsService.getSquads();
    res.json(squads);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function getSquadById(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    const squad = await squadsService.getSquadById(id);

    res.json(squad);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function postSquad(
  req: ValidatedRequest<SquadRequest>,
  res: Response
) {
  try {
    const squad = await squadsService.postSquad(req.body);

    res.status(HttpStatusCode.CREATED).json(squad);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function updateSquad(
  req: ValidatedRequest<SquadRequest>,
  res: Response
) {
  try {
    const { id } = req.params;
    const squad = await squadsService.updateSquad(id, req.body);
    res.json(squad);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function deleteSquad(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const squad = await squadsService.deleteSquad(id);

    res.status(HttpStatusCode.NO_CONTENT).json(squad);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function assignSquadToArmy(
  req: Request<{ squadId: string; armyId: string }>,
  res: Response
) {
  try {
    const { squadId, armyId } = req.params;
    const squad = await squadsService.assignSquadToArmy(squadId, armyId);
    res.json(squad);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function removeSquadFromArmy(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    const squad = await squadsService.removeSquadFromArmy(id);
    res.json(squad);
  } catch (err) {
    if (err instanceof HttpException) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
