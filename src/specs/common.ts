import { enumerations } from "../data";

export function isPositiveByMin(min?: number): boolean {
  return min !== undefined && min >= 0;
}

export function isNegativeByMax(max?: number): boolean {
  return max !== undefined && max <= 0;
}

export function minByPresence(
  presence: enumerations.PresenceType,
  min?: number
): boolean {
  if (
    [
      enumerations.PresenceType.Defined,
      enumerations.PresenceType.Required,
    ].lastIndexOf(presence) > -1 &&
    (min === undefined || min < 1)
  ) {
    return true;
  }
  return false;
}
