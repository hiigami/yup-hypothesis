import { AnySchema } from "yup";

import { SchemaType } from "../data/enumerations";
import { Field, Fields, StrategyConstructor } from "../data/strategies";
import { title } from "../common";
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

import { Handler } from "./handler";

const mapper = new Map<SchemaType, StrategyConstructor>([
  [SchemaType.Boolean, BooleanStrategy],
  [SchemaType.Date, DateStrategy],
  [SchemaType.Email, EmailStrategy],
  [SchemaType.Float, FloatStrategy],
  [SchemaType.Number, NumberStrategy],
  [SchemaType.String, StringStrategy],
  [SchemaType.URL, URLStrategy],
  [SchemaType.UUID, UUIDStrategy],
]);

export class FieldHandler extends Handler {
  canHandle(t: string): boolean {
    const key = title(t);
    const schemaType = SchemaType[key as keyof typeof SchemaType];
    return mapper.has(schemaType);
  }
  handle(schema: AnySchema, _fields?: Fields): Field {
    const specs = this.getSpecs(schema);
    if (specs === undefined) {
      return undefined;
    }
    const strategy = mapper.get(specs.type) as StrategyConstructor;
    return new strategy(specs, schema);
  }
}
