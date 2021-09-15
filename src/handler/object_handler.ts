import { AnyObjectSchema } from "yup";

import { enumerations, handlers } from "../data";
import { SchemaBuilder } from "../schema_builder";
import { ObjectStrategy } from "../strategies";

export class ObjectHandler implements handlers.IHandler {
  getFields(schema: AnyObjectSchema): handlers.Schemas {
    return schema.fields;
  }
  canHandle(t: string): boolean {
    if (t === enumerations.SchemaType.Object.toString()) {
      return true;
    }
    return false;
  }
  handle(schema: AnyObjectSchema, fields?: handlers.Fields): handlers.Field {
    const specs = new SchemaBuilder(schema).specs();
    if (specs === undefined) {
      return undefined;
    }
    return new ObjectStrategy(specs, schema, fields);
  }
}
