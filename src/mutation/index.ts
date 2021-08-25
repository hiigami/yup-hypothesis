import { enumerations } from "../data";

export const mapper = new Map([
  [enumerations.TestMutation.Upper, (x: string) => x.toUpperCase()],
  [enumerations.TestMutation.Lower, (x: string) => x.toLowerCase()],
  [enumerations.TestMutation.Trim, (x: string) => x.trim()],
]);

export const STRING_MUTATIONS = [
  {
    name: enumerations.TestMutation.Upper,
    test: enumerations.TestName.StringCase,
  },
  {
    name: enumerations.TestMutation.Lower,
    test: enumerations.TestName.StringCase,
  },
  { name: enumerations.TestMutation.Trim, test: enumerations.TestName.Trim },
];
