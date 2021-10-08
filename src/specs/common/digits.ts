import { NUMBER_DEFAULTS } from "../../config";
import { SchemaType } from "../../data/enumerations";
import { Maybe } from "../../data/types";

export function getCorrectOffset(
  offset: number,
  type: SchemaType,
  precision = NUMBER_DEFAULTS.precision
): number {
  return type === SchemaType.Number ? offset : offset / Math.pow(10, precision);
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
