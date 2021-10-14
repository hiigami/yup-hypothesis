import { NUMBER_DEFAULTS } from "../../../src/config";
import { SchemaType } from "../../../src/data/enumerations";
import { OffsetSchemaTypeChoices } from "../../../src/data/specs";

import { digits } from "../../../src/specs/common";

const createArgs = (args?: {
  expected?: number;
  offset?: number;
  precision?: number;
  type?: OffsetSchemaTypeChoices;
}) => ({
  expected: args?.expected || 0,
  offset: args?.offset || 0,
  precision: args?.precision,
  type: args?.type || SchemaType.Number,
});

test.each([
  createArgs(),
  createArgs({ offset: 1, expected: 1 }),
  createArgs({
    type: SchemaType.Float,
    offset: 1,
    expected: 1 / Math.pow(10, NUMBER_DEFAULTS.precision),
  }),
  createArgs({
    type: SchemaType.Float,
    offset: -2,
    precision: 2,
    expected: -2 / 1 / Math.pow(10, 2),
  }),
])(
  "should return $expected with (type: $type, offset: $offset, precision: $precision)",
  ({ expected, offset, precision, type }) => {
    const val = digits.getCorrectOffset(offset, type, precision);
    expect(val).toEqual(expected);
  }
);
