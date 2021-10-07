import { STRATEGY_DEFAULTS } from "../../config";
import { enumerations } from "../../data";
import { Sign } from "../../data/enumerations";
import { random } from "../../random";

function getRandomSign(): number {
  return random() < STRATEGY_DEFAULTS.sign ? 1 : -1;
}

export function getSign(sign: enumerations.Sign): number {
  if (sign === enumerations.Sign.Indifferent) {
    return getRandomSign();
  }
  return sign === enumerations.Sign.Positive ? 1 : -1;
}

function valueOrNegative(
  value: number,
  defaultVal: number,
  sign: Sign
): number {
  if (value >= 0 && sign === Sign.Negative) {
    return defaultVal;
  }
  return value;
}

export function getLimitBasedOnSign(
  value: number,
  defaultPositive: number,
  defaultNegative: number,
  sign: Sign
): number {
  if (value <= 0 && sign === Sign.Positive) {
    return defaultPositive;
  }
  return valueOrNegative(value, defaultNegative, sign);
}
