import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export enum ArmyAdvantage{
    AIR = 'air',
    HEAVY_TECH = 'heavy_tech',
    MINEFIELD = 'minefield',
    PATRIOTIC = 'patriotic'
}

export interface Army {
    id: number;
    name: string;
    advantage: ArmyAdvantage;
    user_id: number;
    fuel_amount: number;
    bullets_amount: number;
    created_at: Date;
    updated_at: Date;
  }


  export interface ArmiesCreateSchema {
    name: string;
    advantage: ArmyAdvantage;
    fuel_amount: number;
    bullets_amount: number;
  }

  export interface ArmyRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<
      Army,
      "id" & "created_at" & "updated_at"
    >;
  }