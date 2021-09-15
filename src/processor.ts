import { AnySchema } from "yup";

import { handlers, strategy, types } from "./data";
import { ArrayHandler, FieldHandler, ObjectHandler } from "./handler";

export class Processor {
  private handlers: handlers.IHandler[];
  constructor() {
    this.handlers = [
      new ArrayHandler(),
      new FieldHandler(),
      new ObjectHandler(),
    ];
  }
  private getHandler(schema: AnySchema): types.Maybe<handlers.IHandler> {
    for (const handler of this.handlers) {
      if (handler.canHandle(schema.type)) {
        return handler;
      }
    }
    return undefined;
  }
  private processFields(schemas: AnySchema[]): strategy.Fields {
    const fields: strategy.Fields = {};
    for (const name in schemas) {
      fields[name] = this.run(schemas[name]);
    }
    return fields;
  }
  run(schema: AnySchema): types.Maybe<strategy.IStrategy> {
    const handler = this.getHandler(schema);
    const schemas = handler?.getFields(schema);
    if (schemas !== undefined) {
      const fields = this.processFields(schemas);
      return handler?.handle(schema, fields);
    }
    return handler?.handle(schema);
  }
}
