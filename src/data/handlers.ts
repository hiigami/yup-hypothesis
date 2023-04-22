import { AnyObjectSchema, AnySchema } from "yup";

import { ArraySchemaAny } from "./schemas";
import { Field, Fields } from "./strategies";
import { Maybe } from "./types";

export type Schemas = Maybe<NonNullable<ArraySchemaAny["innerType"]>[]>;
export type Shape = AnyObjectSchema["fields"];

type IHandlerType = Schemas | Shape;
export interface IHandler {
  canHandle(t: AnySchema): boolean;
  getFields(schema: AnySchema): IHandlerType;
  handle(schema: AnySchema, fields?: Fields): Field;
}
