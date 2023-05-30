import { AnySchema } from "yup";

import { SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Field, Fields } from "../data/strategies";
import { Maybe } from "../data/types";
import { SchemaBuilder } from "../schema_builder";

export abstract class Handler<T> {
  protected schemaType: Maybe<SchemaType>;
  constructor(schemaType?: SchemaType) {
    this.schemaType = schemaType;
  }
  protected getSpecs(schema: AnySchema, fields?: Fields): Maybe<Specs> {
    return new SchemaBuilder(schema).specs(fields);
  }
  getFields(_schema: AnySchema): Maybe<T> {
    return undefined;
  }
  canHandle(t: AnySchema): boolean {
    if (t.type === this.schemaType) {
      return true;
    }
    return false;
  }
  abstract handle(schema: AnySchema, fields?: Fields): Field;
}
