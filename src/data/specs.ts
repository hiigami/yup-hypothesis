import { PresenceType, SchemaType, Sign } from "./enumerations";

export interface SpecMutation {
  (value: unknown): unknown;
}

export type DefaultFn = () => unknown;

export interface DefaultSpecs {
  default?: unknown | DefaultFn;
  choices?: Array<unknown>;
  nullable: boolean;
  presence: PresenceType;
}

export interface BaseSpecs extends DefaultSpecs {
  type: SchemaType;
  mutations?: SpecMutation[];
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
