import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface Squad {
    id: number;
    name: string;
    army_id: number;
    created_at: Date;
    updated_at: Date;
  }


  export interface SquadsCreateSchema {
    name: string;
  }

  export interface SquadRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<
    Squad,
      "id" & "created_at" & "updated_at" & "army_id"
    >;
  }