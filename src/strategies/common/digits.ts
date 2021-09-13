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

function minOrNegative(min: number, sign: Sign): number {
  if (min >= 0 && sign === Sign.Negative) {
    return -1;
  }
  return min;
}

export function getMinBasedOnSign(min: number, sign: Sign): number {
  if (min <= 0 && sign === Sign.Positive) {
    return 1;
  }
  return minOrNegative(min, sign);
}
