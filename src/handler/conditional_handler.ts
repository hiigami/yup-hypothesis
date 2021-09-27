import { AnySchema } from "yup";

import { SchemaType } from "../data/enumerations";
import { Field, Fields } from "../data/strategies";
import { ConditionalStrategy } from "../strategies";

import { Handler } from "./handler";

export class ConditionalHandler extends Handler {
  constructor() {
    super(SchemaType.Conditional);
  }
  canHandle(t: AnySchema): boolean {
    const conditions = t["conditions"];
    return conditions !== undefined && conditions.length > 0;
  }
  handle(schema: AnySchema, _fields?: Fields): Field {
    const specs = this.getSpecs(schema);
    if (specs === undefined) {
      return undefined;
    }
    return new ConditionalStrategy(specs, schema);
  }
}
