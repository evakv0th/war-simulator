import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface Plane {
    id: number;
    name: string;
    air_strength: number;
    surface_strength: number;
    fuel_req: number;
    army_id: number;
    created_at: Date;
    updated_at: Date;
  }


  export interface PlanesCreateSchema {
    name: string;
    air_strength: number;
    surface_strength: number;
    fuel_req: number;
  }

  export interface PlaneRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<
    Plane,
      "id" & "created_at" & "updated_at" & "army_id"
    >;
  }