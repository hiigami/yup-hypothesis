import { constrains, enumerations, specs } from "../data";
import { random, randomIntInclusive } from "../random";
import { SIGN_CHANGE } from "./constant";

export function getSign(sign?: enumerations.Sign): number {
  if (sign === enumerations.Sign.Negative) {
    return -1;
  } else if (sign === enumerations.Sign.Positive) {
    return 1;
  }
  return random() < SIGN_CHANGE ? 1 : -1;
}

function getCorrectMaxMin(max: number, min: number): number[] {
  if (max < min) {
    return [min, max];
  }
  return [max, min];
}

function withinConstrain(
  val: number,
  constrain: constrains.Constrain
): boolean {
  if (constrain.min <= val && val <= constrain.max) {
    return true;
  }
  return false;
}

export function getLength(
  val: number,
  constrain: constrains.Constrain
): number {
  if (withinConstrain(val, constrain)) {
    return val;
  }
  return randomIntInclusive(constrain.max, constrain.min);
}

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

export function getValidValueOrBest(
  constrain: constrains.Constrain,
  val: number
): number {
  if (withinConstrain(val, constrain)) {
    return val;
  }
  if (val < constrain.min) {
    return constrain.min;
  }
  return constrain.max;
}

export function getLengthForStrings(
  specs: specs.Specs,
  constrains: constrains.Constrain,
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
