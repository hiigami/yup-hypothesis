import { Constrain } from "../../data/constrains";
import { randomIntInclusive } from "../../random";

export function genText(size: number, chars: Constrain): string {
  const s = [];
  for (let i = 0; i < size; i++) {
    const c = randomIntInclusive(chars.max, chars.min);
    s.push(String.fromCharCode(c));
  }
  return s.join("");
}
