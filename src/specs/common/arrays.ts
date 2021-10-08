import { PresenceType } from "../../data/enumerations";

export function minByPresence(presence: PresenceType, min?: number): boolean {
  if (
    [PresenceType.Defined, PresenceType.Required].lastIndexOf(presence) > -1 &&
    (min === undefined || min < 1)
  ) {
    return true;
  }
  return false;
}
