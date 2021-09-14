import { constrains, enumerations } from "./data";

type InternetConstrain = constrains.EmailConstrain | constrains.URLConstrain;

export function createConstrain(
  min: number,
  max: number
): constrains.Constrain {
  return { min, max };
}

export function createInternetConstrain<T extends InternetConstrain>(
  min: number,
  max: number,
  key: enumerations.InternetConstrainType
): T {
  return {
    ...createConstrain(min, max),
    [key]: { max: 64, min: 2 },
    entity: { max: 186, min: 1 },
    tld: { max: 16, min: 1 },
  } as T;
}

export function title(s: string): string {
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}
