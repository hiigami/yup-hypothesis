import { constrains } from "../../data";

export function orderValues(value1: number, value2: number): [number, number] {
  if (value1 < value2) {
    return [value2, value1];
  }
  return [value1, value2];
}

export function withinConstrain(
  val: number,
  constrain: constrains.Constrain
): boolean {
  if (constrain.min <= val && val <= constrain.max) {
    return true;
  }
  return false;
}

export function getValidValueOrBest(
  constrain: constrains.Constrain,
  val: number
): number {
  if (withinConstrain(val, constrain)) {
    return val;
  }
  return val < constrain.min ? constrain.min : constrain.max;
}
