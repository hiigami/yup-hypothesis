import { Sign } from "./enumerations";

export interface Constrain {
  max: number;
  min: number;
}

export interface FloatConstrain extends Constrain {
  precision: number;
}

export interface BaseSpecs {
  type: string;
  default?: any;
  choices?: Array<any>;
  nullable: boolean;
  presence: string;
}

export interface BooleanSpecs extends BaseSpecs {}

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

export interface Specs
  extends BaseSpecs,
    BooleanSpecs,
    StringSpecs,
    FloatSpecs {}
