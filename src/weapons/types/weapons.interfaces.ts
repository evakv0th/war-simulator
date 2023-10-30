import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface Weapon {
  id: number;
  name: string;
  strength: number;
  bullets_req: number;
  created_at: Date;
  updated_at: Date;
}

export interface WeaponsCreateSchema {
  name: string;
  strength: number;
  bullets_req: number;
}

export interface WeaponRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<Weapon, "id" & "created_at" & "updated_at">;
}
