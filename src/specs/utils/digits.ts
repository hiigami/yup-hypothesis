import {
  SchemaType,
  Sign,
  TestParameter,
  TestName,
} from "../../data/enumerations";
import { LimitOption, SignFN, SignMapper } from "../../data/specs";
import { Maybe } from "../../data/types";
import { FLOAT_DEFAULTS } from "../../strategies/constant";

export function getCorrectOffset(
  offset: number,
  type: SchemaType,
  precision = FLOAT_DEFAULTS.precision
): number {
  return type === SchemaType.Number ? offset : offset / Math.pow(10, precision);
}

export function isPositiveByMin(min?: number): boolean {
  return min !== undefined && min >= 0;
}

export function isNegativeByMax(max?: number): boolean {
  return max !== undefined && max <= 0;
}

export function createSingMapper(
  withName: string,
  sign: Sign,
  fn: SignFN
): Readonly<SignMapper> {
  return {
    with: withName,
    sign,
    fn,
  };
}

export function createLimitOption(
  param: TestParameter,
  offset = 0,
  test?: TestName
): Readonly<LimitOption> {
  return Object.freeze({
    param,
    test,
    offset,
  });
}

export function signHelper(
  use: string,
  max?: number,
  min?: number
): Maybe<number> {
  if (use === "min") {
    return min;
  }
  return max;
}
