import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface Tank {
    id: number;
    name: string;
    strength: number;
    fuel_req: number;
    army_id: number;
    created_at: Date;
    updated_at: Date;
  }


  export interface TanksCreateSchema {
    name: string;
    strength: number;
    fuel_req: number;
  }

  export interface TankRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<
    Tank,
      "id" & "created_at" & "updated_at" & "army_id"
    >;
  }