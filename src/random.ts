import { ReadOnlyArray } from "./data/types";

export function random(): number {
  return Math.random();
}

export function randomBoolean(): boolean {
  return random() < 0.5;
}

export function randomIntInclusive(high: number, low = 0): number {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

export function randomChoice<T>(options: ReadOnlyArray<T>): T {
  const c = randomIntInclusive(options.length - 1);
  return options[c];
}
