import { AnySchema } from "yup";
import { enumerations } from "../../src/data";
import { createConstrain } from "../../src/common";
import { StrategyConstructor } from "../../src/data/strategies";

export function addDecimals(n: number, precision: number): number {
  let zeros: number[] = [];
  zeros.length = precision - 1;
  zeros = zeros.fill(0);
  return Number(`0.${zeros.join("")}${n}`);
}

export function uuidCheck(val: string): boolean {
  return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g.test(
    val
  );
}

export function emailCheck(val: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g.test(
    val
  );
}

export function urlCheck(val: string): boolean {
  // eslint-disable-next-line no-control-regex,no-useless-escape
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(
    val
  );
}

export function randIntIncMinEq0Is1OrMax(max: number, min?: number): number {
  if (min === 0) {
    return 1;
  }
  return max;
}

export function randIntIncMaxEqDefaultAndMinEq0Is1OrMax(maxDefault: number) {
  return (max: number, min?: number): number => {
    if (max === maxDefault) {
      if (min === 0) {
        return 1;
      }
    }
    return max;
  };
}

const createSpecs = (args?: {
  type?: enumerations.SchemaType;
  presence?: enumerations.PresenceType;
  sign?: enumerations.Sign;
  nullable?: boolean;
  min?: number;
  max?: number;
  length?: number;
}) => ({
  type: args?.type || enumerations.SchemaType.String,
  nullable: args?.nullable || false,
  presence: args?.presence || enumerations.PresenceType.Required,
  sign: args?.sign,
  min: args?.min,
  max: args?.max,
  length: args?.length,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createTestItem = (args: {
  name?: string;
  constrain?: {
    min: number;
    max: number;
  };
  specs?: {
    nullable?: boolean;
    length?: number;
    max?: number;
    min?: number;
    presence?: enumerations.PresenceType;
    sign?: enumerations.Sign;
    type?: enumerations.SchemaType;
  };
  expected: unknown;
  // eslint-disable-next-line @typescript-eslint/ban-types
  check?: Function;
  schema?: AnySchema;
  strategy?: StrategyConstructor;
  strict?: boolean;
  randIntVal?: number;
  randVal?: number;
  toBeCalledWith?: unknown[];
}) => ({
  specs: createSpecs(args.specs),
  randIntVal: args.randIntVal,
  randVal: args.randVal,
  toBeCalledWith: args.toBeCalledWith,
  strict: args.strict,
  schema: args.schema,
  strategy: args.strategy,
  name: args.name,
  check: args.check,
  constrain:
    args.constrain === undefined
      ? undefined
      : createConstrain(args.constrain?.min, args.constrain?.max),
  expected: args.expected,
});
