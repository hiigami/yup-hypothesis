import { AnySchema } from "yup";

import { is } from "./common";
import { handlers, strategy, types } from "./data";
import { Reference } from "./data/handlers";
import {
  ArrayHandler,
  ConditionalHandler,
  FieldHandler,
  ObjectHandler,
  ReferenceHandler,
  TupleHandler,
} from "./handler";

export default class Processor {
  private static instance: Processor;
  private handlers: types.ReadOnlyArray<handlers.IHandler>;
  private refHandler;
  private constructor() {
    this.handlers = Object.freeze([
      new ConditionalHandler(),
      new ArrayHandler(),
      new FieldHandler(),
      new ObjectHandler(),
      new TupleHandler(),
    ]);
    this.refHandler = new ReferenceHandler();
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
      if (
        is<AnySchema, unknown>(rawFields[name] as AnySchema, "spec") &&
        (rawFields[name] as AnySchema).spec.strip !== true
      ) {
        fields[name] = this.run(rawFields[name] as AnySchema);
      } else if (this.refHandler.canHandle(rawFields[name])) {
        fields[name] = this.refHandler.handle(rawFields[name] as Reference);
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
