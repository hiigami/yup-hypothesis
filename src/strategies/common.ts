import { Constrain, Specs } from "../data";
import { Sign } from "../data/enumerations";
import { random, randomIntInclusive } from "../random";
import { SIGN_CHANGE } from "./constant";

export function getSign(sign?: Sign): number {
  if (sign === Sign.Negative) {
    return -1;
  } else if (sign === Sign.Positive) {
    return 1;
  }
  return random() < SIGN_CHANGE ? 1 : -1;
}

export function getCorrectMaxMin(max: number, min: number): number[] {
  if (max < min) {
    return [min, max];
  }
  return [max, min];
}

export function withinConstrain(val: number, constrain: Constrain): boolean {
  if (constrain.min <= val && val <= constrain.max) {
    return true;
  }
  return false;
}

export function getLength(val: number, constrain: Constrain): number {
  if (withinConstrain(val, constrain)) {
    return val;
  }
  return randomIntInclusive(constrain.max, constrain.min);
}

export function getValidValue(
  constrain: Constrain,
  defaults: number,
  val?: number
): number {
  if (val !== undefined && withinConstrain(val, constrain)) {
    return val;
  }
  return defaults;
}

export function getValidValueOrBest(constrain: Constrain, val: number): number {
  if (withinConstrain(val, constrain)) {
    return val;
  }
  if (val < constrain.min) {
    return constrain.min;
  }
  return constrain.max;
}

export function getLengthForStrings(
  specs: Specs,
  constrains: Constrain,
  strict = false
): number {
  if (specs.length !== undefined) {
    return strict ? getLength(specs.length, constrains) : specs.length;
  }
  let max = getValidValue(constrains, constrains.max, specs.max);
  let min = getValidValue(constrains, constrains.min, specs.min);
  [max, min] = getCorrectMaxMin(max, min);
  return randomIntInclusive(max, min);
}

export function textGenerator(size: number, stack: string): string {
  const s = [];
  for (let i = 0; i < size; i++) {
    const c = randomIntInclusive(stack.length - 1);
    s.push(stack[c]);
  }
  return s.join("");
}
