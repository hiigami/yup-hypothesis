import { AnyObjectSchema } from "yup";

import { handlers } from "../data";
import { SchemaType } from "../data/enumerations";
import { Field, Fields } from "../data/strategies";
import { ObjectStrategy } from "../strategies";
import { Handler } from "./handler";

export class ObjectHandler extends Handler<handlers.Shape> {
  constructor() {
    super(SchemaType.Object);
  }
  getFields(schema: AnyObjectSchema): handlers.Shape {
    return schema.fields;
  }
  handle(schema: AnyObjectSchema, fields?: Fields): Field {
    const specs = this.getSpecs(schema, fields);
    if (specs === undefined) {
      return undefined;
    }
    return new ObjectStrategy({ specs, schema, fields });
  }
}
