import { constrains, specs } from "../../data";
import { randomIntInclusive } from "../../random";
import { getValidValueOrBest, orderValues, withinConstrain } from "./general";

function getValidValue(
  constrain: constrains.Constrain,
  defaults: number,
  val?: number
): number {
  if (val !== undefined && withinConstrain(val, constrain)) {
    return val;
  }
  return defaults;
}

function getMinAndMax(
  specs: specs.Specs,
  constrains: constrains.Constrain
): number[] {
  const max = getValidValue(constrains, constrains.max, specs.max);
  const min = getValidValue(constrains, constrains.min, specs.min);
  return orderValues(max, min);
}

export function getLength(
  specs: specs.Specs,
  constrains: constrains.Constrain,
  strict = false
): number {
  if (specs.length !== undefined) {
    return strict
      ? getValidValueOrBest(constrains, specs.length)
      : specs.length;
  }
  const [min, max] = getMinAndMax(specs, constrains);
  return randomIntInclusive(max, min);
}
