import { AnySchema } from "yup";

import { handlers, strategy, types } from "./data";
import {
  ArrayHandler,
  ConditionalHandler,
  FieldHandler,
  ObjectHandler,
} from "./handler";

export default class Processor {
  private static instance: Processor;
  private handlers: types.ReadOnlyArray<handlers.IHandler>;
  private constructor() {
    this.handlers = Object.freeze([
      new ConditionalHandler(),
      new ArrayHandler(),
      new FieldHandler(),
      new ObjectHandler(),
    ]);
  }
  private getHandler(schema: AnySchema): types.Maybe<handlers.IHandler> {
    for (const handler of this.handlers) {
      if (handler.canHandle(schema)) {
        return handler;
      }
    }
    return undefined;
  }
  private processFields(schemas: AnySchema[]): strategy.Fields {
    const fields: strategy.Fields = {};
    for (const name in schemas) {
      if (schemas[name].spec.strip !== true) {
        fields[name] = this.run(schemas[name]);
      }
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
  static getInstance(): Processor {
    if (!Processor.instance) {
      Processor.instance = new Processor();
    }
    return Processor.instance;
  }
}
