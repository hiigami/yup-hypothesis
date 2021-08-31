import * as yup from "yup";

import { enumerations, strategy } from "../data";
import { title } from "../common";
import { SchemaBuilder } from "../schema_builder";
import * as strategies from "../strategies";

export interface Handler {
  canHandle(t: string): boolean;
  handle(schema: yup.AnySchema): strategy.Field;
}

const mapper = new Map<enumerations.SchemaType, strategies.StrategyConstructor>(
  [
    [enumerations.SchemaType.Boolean, strategies.BooleanStrategy],
    [enumerations.SchemaType.Date, strategies.DateStrategy],
    [enumerations.SchemaType.Email, strategies.EmailStrategy],
    [enumerations.SchemaType.Float, strategies.FloatStrategy],
    [enumerations.SchemaType.Number, strategies.NumberStrategy],
    [enumerations.SchemaType.String, strategies.StringStrategy],
    [enumerations.SchemaType.URL, strategies.URLStrategy],
    [enumerations.SchemaType.UUID, strategies.UUIDStrategy],
  ]
);

export class FieldHandler implements Handler {
  canHandle(t: string): boolean {
    const key = title(t);
    const schemaType =
      enumerations.SchemaType[key as keyof typeof enumerations.SchemaType];
    return mapper.has(schemaType);
  }
  handle(schema: yup.AnySchema): strategy.Field {
    const specs = new SchemaBuilder(schema).specs();
    if (specs === undefined) {
      return undefined;
    }
    const strategy = mapper.get(specs.type) as strategies.StrategyConstructor;
    return new strategy(specs);
  }
}

export class ObjectHandler implements Handler {
  canHandle(t: string): boolean {
    if (t === enumerations.SchemaType.Object.toString()) {
      return true;
    }
    return false;
  }
  private _getFieldStrategy(
    handler: Handler,
    field: yup.AnySchema
  ): strategy.Field {
    if (handler.canHandle(field.type)) {
      return handler.handle(field);
    }
    return this.canHandle(field.type)
      ? this.handle(field as yup.AnyObjectSchema)
      : undefined;
  }
  private _getFields(schema: yup.AnyObjectSchema): strategy.Fields {
    const fields: strategy.Fields = {};
    const handler = new FieldHandler();
    for (const x in schema.fields) {
      const field = schema.fields[x] as yup.AnySchema;
      fields[x] = this._getFieldStrategy(handler, field);
    }
    return fields;
  }
  handle(schema: yup.AnyObjectSchema): strategy.Field {
    const specs = new SchemaBuilder(schema).specs();
    if (specs === undefined) {
      return undefined;
    }
    const fields = this._getFields(schema);
    return new strategies.ObjectStrategy(specs, fields);
  }
}
