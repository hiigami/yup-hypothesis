import { AnySchema, ref } from "yup";

import { is } from "./common";
import { handlers, strategy, types } from "./data";
import {
  ArrayHandler,
  ConditionalHandler,
  FieldHandler,
  ObjectHandler,
  TupleHandler,
} from "./handler";

type Reference = ReturnType<typeof ref>;

export default class Processor {
  private static instance: Processor;
  private handlers: types.ReadOnlyArray<handlers.IHandler>;
  private constructor() {
    this.handlers = Object.freeze([
      new ConditionalHandler(),
      new ArrayHandler(),
      new FieldHandler(),
      new ObjectHandler(),
      new TupleHandler(),
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
  private processFields<T>(rawFields: T): strategy.Fields {
    const fields: strategy.Fields = {};
    for (const name in rawFields) {
      /** @todo add reference logic */
      if (
        is<AnySchema, Reference>(rawFields[name] as AnySchema, "spec") &&
        (rawFields[name] as AnySchema).spec.strip !== true
      ) {
        fields[name] = this.run(rawFields[name] as AnySchema);
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
