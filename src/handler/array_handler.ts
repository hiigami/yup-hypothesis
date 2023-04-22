import { ArraySchema } from "yup";

import { handlers } from "../data";
import { SchemaType } from "../data/enumerations";
import { Field, Fields } from "../data/strategies";
import { ArrayStrategy } from "../strategies";
import { Handler } from "./handler";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArraySchemaAny = ArraySchema<any, any, any, any>;

export class ArrayHandler extends Handler<handlers.Schemas> {
  constructor() {
    super(SchemaType.Array);
  }
  getFields(schema: ArraySchemaAny): handlers.Schemas {
    return schema.innerType === undefined ? undefined : [schema.innerType];
  }
  handle(schema: ArraySchemaAny, fields?: Fields): Field {
    const specs = this.getSpecs(schema);
    if (specs === undefined) {
      return undefined;
    }
    const field = fields === undefined ? undefined : fields[0];
    return new ArrayStrategy({ specs, schema, element: field });
  }
}
