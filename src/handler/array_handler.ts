import { ArraySchema } from "yup";

import { enumerations, handlers } from "../data";
import { SchemaBuilder } from "../schema_builder";
import { ArrayStrategy } from "../strategies";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArraySchemaAny = ArraySchema<any, any, any, any>;

export class ArrayHandler implements handlers.IHandler {
  getFields(schema: ArraySchemaAny): handlers.Schemas {
    return schema.innerType === undefined ? undefined : [schema.innerType];
  }
  canHandle(t: string): boolean {
    if (t === enumerations.SchemaType.Array.toString()) {
      return true;
    }
    return false;
  }
  handle(schema: ArraySchemaAny, fields?: handlers.Fields): handlers.Field {
    const specs = new SchemaBuilder(schema).specs();
    if (specs === undefined) {
      return undefined;
    }
    const field = fields === undefined ? undefined : fields[0];
    return new ArrayStrategy(specs, schema, field);
  }
}
