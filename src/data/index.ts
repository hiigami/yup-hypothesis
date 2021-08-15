import { PresenceType, SchemaType, Sign } from "./enumerations";

export interface Constrain {
  max: number;
  min: number;
}

export interface EmailConstrain extends Constrain {
  username: Constrain;
  entity: Constrain;
}

export interface FloatConstrain extends Constrain {
  precision: number;
}

export interface StringConstrain extends Constrain {
  chars: Constrain;
}

// interface Transform {
//   (value: any): any;
// }

export interface BaseSpecs {
  type: SchemaType;
  default?: any;
  choices?: Array<any>;
  nullable: boolean;
  presence: PresenceType;
  // transform?: Transform[];
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
