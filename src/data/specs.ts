import { AnySchema } from "yup";

import {
  PresenceType,
  SchemaType,
  Sign,
  TestParameter,
  TestName,
} from "./enumerations";

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

export interface ArraySpecs extends BaseSpecs {
  min?: number;
  max?: number;
  length?: number;
}

export interface DateSpecs extends BaseSpecs {
  min?: number;
  max?: number;
}

export interface ObjectSpecs extends BaseSpecs {
  noUnknown?: boolean;
}

export interface NumberSpecs extends DateSpecs {
  sign?: Sign;
}

export interface FloatSpecs extends NumberSpecs {
  precision?: number;
}

export type StringSpecs = ArraySpecs;

export interface Specs extends BaseSpecs, ArraySpecs, FloatSpecs, ObjectSpecs {}

export type SignFN = (num?: number) => boolean;

export interface SignMapper {
  readonly with: string;
  readonly sign: Sign;
  fn: SignFN;
}

export interface LimitOption {
  readonly param: TestParameter;
  readonly test?: TestName;
  readonly offset: number;
}
