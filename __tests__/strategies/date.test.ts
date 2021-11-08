import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { createSpecs, createTestItem } from "../utils";

import { STRATEGY_DEFAULTS } from "../../src/config";
import { enumerations } from "../../src/data";
import { DateStrategy } from "../../src/strategies";

type Fn = (value: unknown) => void;

const specs = createSpecs({ type: enumerations.SchemaType.Date });
const schema = yup.date().required();

const defaultCheck = (x: unknown) => expect(x).toBeInstanceOf(Date);
const dateTestItem = (args?: {
  strict?: boolean;
  randomMockValue?: number;
  check?: Fn;
  name?: string;
}) =>
  createTestItem({
    name: args?.name ?? "Date",
    specs: { ...specs, strict: args?.strict },
    randomMockValue: args?.randomMockValue ?? STRATEGY_DEFAULTS.bool - 0.01,
    check: args?.check ?? defaultCheck,
  });

test.each([
  dateTestItem({ strict: true }),
  dateTestItem({
    name: "String",
    strict: false,
    randomMockValue: STRATEGY_DEFAULTS.bool + 0.01,
    check: (val) => expect(typeof val).toEqual("string"),
  }),
  dateTestItem(),
])(
  "should be date of type $name with strict: $specs.strict",
  ({ specs, randomMockValue, check }) => {
    randomMock
      .mockReturnValue(0)
      .mockReturnValueOnce(randomMockValue as number);
    randomIntInclusiveMock.mockReturnValue(1);

    const val = new DateStrategy({
      specs,
      schema,
    }).draw();
    (check as Fn)(val);
  }
);

test("should respect max and min", () => {
  const expected = new Date(7);
  randomIntInclusiveMock.mockReturnValue(expected.getTime());

  const minDate = new Date(4).getTime();
  const maxDate = new Date(10).getTime();

  const val = new DateStrategy({
    specs: { ...specs, min: minDate, max: maxDate, strict: true },
    schema: schema.required().min(minDate).max(maxDate),
  }).draw();

  expect((val as Date).toISOString()).toBe(expected.toISOString());
  expect(randomIntInclusiveMock.mock.calls).toEqual([[maxDate, minDate]]);
});
