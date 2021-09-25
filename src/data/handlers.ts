import { AnySchema } from "yup";

import { Fields, Field } from "./strategies";
import { Maybe } from "./types";

export type Schemas = Maybe<AnySchema[]>;

export interface IHandler {
  canHandle(t: AnySchema): boolean;
  getFields(schema: AnySchema): Schemas;
  handle(schema: AnySchema, fields?: Fields): Field;
}
