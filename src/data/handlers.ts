import { AnyObjectSchema, ref } from "yup";

import { ArraySchemaAny } from "./schemas";
import { Field, Fields } from "./strategies";
import { Maybe } from "./types";

export type Schemas = Maybe<NonNullable<ArraySchemaAny["innerType"]>[]>;
export type Shape = AnyObjectSchema["fields"];
export type Reference = ReturnType<typeof ref>;

type IHandlerType = Schemas | Shape;
export interface IHandler {
  canHandle(t: any): boolean;
  getFields(schema: any): IHandlerType;
  handle(schema: any, fields?: Fields): Field;
}
