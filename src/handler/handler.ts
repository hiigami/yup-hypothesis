import { AnySchema } from "yup";

import { handlers } from "../data";
import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Field, Fields } from "../data/strategies";
import { Maybe } from "../data/types";
import { SchemaBuilder } from "../schema_builder";

export abstract class Handler {
  protected schemaType: Maybe<SchemaType>;
  constructor(schemaType?: SchemaType) {
    this.schemaType = schemaType;
  }
  protected getSpecs(schema: AnySchema): Maybe<Specs> {
    return new SchemaBuilder(schema).specs();
  }
  getFields(_schema: AnySchema): handlers.Schemas {
    return undefined;
  }
  canHandle(t: string): boolean {
    if (t === this.schemaType) {
      return true;
    }
    return false;
  }
  abstract handle(schema: AnySchema, fields?: Fields): Field;
}
