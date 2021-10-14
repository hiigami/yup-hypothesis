import { PresenceType } from "../../../src/data/enumerations";

import { arrays } from "../../../src/specs/common";

const createArgs = (args?: {
  expected?: boolean;
  presence?: PresenceType;
  min?: number;
}) => ({
  expected: args?.expected ?? true,
  presence: args?.presence || PresenceType.Required,
  min: args?.min,
});

test.each([
  createArgs(),
  createArgs({ min: 0 }),
  createArgs({ min: 1, expected: false }),
  createArgs({ presence: PresenceType.Defined }),
  createArgs({ presence: PresenceType.Defined, min: 0 }),
  createArgs({ presence: PresenceType.Defined, min: 1, expected: false }),
  createArgs({ presence: PresenceType.Optional, expected: false }),
  createArgs({ presence: PresenceType.Optional, min: 0, expected: false }),
])(
  "should return $expected with (presence: $presence, min: $min)",
  ({ expected, presence, min }) => {
    const val = arrays.minByPresence(presence, min);
    expect(val).toEqual(expected);
  }
);
