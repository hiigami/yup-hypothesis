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

export interface DefaultSpecs {
  default?: unknown | (() => unknown) /**@todo */;
  choices?: Array<unknown>;
  nullable: boolean;
  presence: PresenceType;
}

export interface BaseSpecs extends DefaultSpecs {
  type: SchemaType;
  // transform?: Transform[];
}

export type BooleanSpecs = BaseSpecs;

export interface StringSpecs extends BaseSpecs {
  min?: number;
  max?: number;
  length?: number;
  trim?: boolean;
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
