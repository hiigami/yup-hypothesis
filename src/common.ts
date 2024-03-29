import { constrains, enumerations } from "./data";

type InternetConstrain = constrains.EmailConstrain | constrains.URLConstrain;

export function createConstrain(
  min: number,
  max: number
): Readonly<constrains.Constrain> {
  return Object.freeze({ min, max });
}

export function createInternetConstrain<T extends InternetConstrain>(
  min: number,
  max: number,
  key: enumerations.InternetConstrainType
): Readonly<T> {
  return Object.freeze({
    ...createConstrain(min, max),
    [key]: createConstrain(2, 64),
    entity: createConstrain(1, 186),
    tld: createConstrain(1, 16),
  } as T);
}

export function title(s: string): Capitalize<string> {
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}` as Capitalize<string>;
}

export function is<A, B>(x: A | B, ...m: (keyof A)[]): x is A {
  for (const k of m) {
    if ((x as A)[k] === undefined) {
      return false;
    }
  }
  return true;
}
