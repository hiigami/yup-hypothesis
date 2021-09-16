import { enumerations } from "../../data";
import { Sign } from "../../data/enumerations";
import { random } from "../../random";
import { STRATEGY_DEFAULTS } from "../constant";

function getRandomSign(): number {
  return random() < STRATEGY_DEFAULTS.sign ? 1 : -1;
}

export function getSign(sign?: enumerations.Sign): number {
  if (sign === enumerations.Sign.Indifferent) {
    return getRandomSign();
  }
  return sign === enumerations.Sign.Positive ? 1 : -1;
}

function minOrNegative(min: number, defaultVal: number, sign: Sign): number {
  if (min >= 0 && sign === Sign.Negative) {
    return defaultVal;
  }
  return min;
}

export function getLimitBasedOnSign(
  min: number,
  defaultPositive: number,
  defaultNegative: number,
  sign: Sign
): number {
  if (min <= 0 && sign === Sign.Positive) {
    return defaultPositive;
  }
  return minOrNegative(min, defaultNegative, sign);
}
