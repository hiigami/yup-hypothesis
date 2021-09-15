import { AnySchema } from "yup";

import { enumerations, handlers, strategy } from "../data";
import { title } from "../common";
import { SchemaBuilder } from "../schema_builder";
import {
  BooleanStrategy,
  DateStrategy,
  EmailStrategy,
  FloatStrategy,
  NumberStrategy,
  StringStrategy,
  URLStrategy,
  UUIDStrategy,
} from "../strategies";

const mapper = new Map<enumerations.SchemaType, strategy.StrategyConstructor>([
  [enumerations.SchemaType.Boolean, BooleanStrategy],
  [enumerations.SchemaType.Date, DateStrategy],
  [enumerations.SchemaType.Email, EmailStrategy],
  [enumerations.SchemaType.Float, FloatStrategy],
  [enumerations.SchemaType.Number, NumberStrategy],
  [enumerations.SchemaType.String, StringStrategy],
  [enumerations.SchemaType.URL, URLStrategy],
  [enumerations.SchemaType.UUID, UUIDStrategy],
]);

export class FieldHandler implements handlers.IHandler {
  getFields(_schema: AnySchema): handlers.Schemas {
    return undefined;
  }
  canHandle(t: string): boolean {
    const key = title(t);
    const schemaType =
      enumerations.SchemaType[key as keyof typeof enumerations.SchemaType];
    return mapper.has(schemaType);
  }
  handle(schema: AnySchema, _fields?: handlers.Fields): handlers.Field {
    const specs = new SchemaBuilder(schema).specs();
    if (specs === undefined) {
      return undefined;
    }
    const strategy = mapper.get(specs.type) as strategy.StrategyConstructor;
    return new strategy(specs, schema);
  }
}
