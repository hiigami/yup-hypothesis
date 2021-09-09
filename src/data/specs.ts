import { AnySchema } from "yup";

import { PresenceType, SchemaType, Sign } from "./enumerations";

export interface SpecMutation<T> {
  (this: T, value: unknown, originalValue: unknown, schema: T): unknown;
}

export type DefaultFn = () => unknown;

export interface BaseSpecs {
  choices?: Array<unknown>;
  default?: unknown | DefaultFn;
  exclude?: Set<unknown>;
  mutations?: SpecMutation<AnySchema>[];
  nullable: boolean;
  presence: PresenceType;
  type: SchemaType;
}

export type BooleanSpecs = BaseSpecs;

export interface StringSpecs extends BaseSpecs {
  min?: number;
  max?: number;
  length?: number;
}

export interface NumberSpecs extends BaseSpecs {
  min?: number;
  max?: number;
  sign?: Sign;
}

export interface FloatSpecs extends NumberSpecs {
  precision?: number;
}

export interface DateSpecs extends BaseSpecs {
  min?: number;
  max?: number;
}

export interface Specs
  extends BaseSpecs,
    BooleanSpecs,
    StringSpecs,
    FloatSpecs,
    DateSpecs {}
