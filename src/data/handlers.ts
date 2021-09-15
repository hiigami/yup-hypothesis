import { AnySchema } from "yup";

import { IStrategy } from "./strategies";
import { Dict, Maybe } from "./types";

export type Field = Maybe<IStrategy>;
export type Fields = Dict<Field>;
export type Schemas = Maybe<AnySchema[]>;

export interface IHandler {
  canHandle(t: string): boolean;
  getFields(schema: AnySchema): Schemas;
  handle(schema: AnySchema, fields?: Fields): Field;
}
