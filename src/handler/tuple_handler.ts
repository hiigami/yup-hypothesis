import { TupleSchema } from "yup";

import { handlers } from "../data";
import { SchemaType } from "../data/enumerations";
import { Field, Fields } from "../data/strategies";
import { typeToDrawableMapper } from "../mapper";
import { TupleStrategy } from "../strategies";
import { Handler } from "./handler";

export class TupleHandler extends Handler<handlers.Schemas> {
  constructor() {
    super(SchemaType.Tuple);
  }
  getFields(schema: TupleSchema): handlers.Schemas {
    return schema.spec.types;
  }
  handle(schema: TupleSchema, fields?: Fields): Field {
    const specs = this.getSpecs(schema);
    if (specs === undefined) {
      return undefined;
    }
    return new TupleStrategy({ specs, schema, fields }, typeToDrawableMapper);
  }
}
