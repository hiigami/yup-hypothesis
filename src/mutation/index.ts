import { enumerations } from "../data";

export const mapper = new Map([
  [enumerations.TestMutation.Upper, (x: string) => x.toUpperCase()],
  [enumerations.TestMutation.Lower, (x: string) => x.toLowerCase()],
]);
