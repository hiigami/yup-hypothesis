import { randomIntInclusiveMock, randomMock } from "../../jest.setup";
import { addDecimals } from "../utils";

import { Specs } from "../../src/data";
import { PresenceType, SchemaType, Sign } from "../../src/data/enumerations";
import { FloatStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be float", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: false,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(!Number.isInteger(val)).toBeTruthy();
});

test("should be nullable", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: true,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeNull();
});

test("should be default", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: true,
    presence: PresenceType.Required,
    default: -33,
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBe(specs.default);
});

test("should be one of", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: false,
    presence: PresenceType.Required,
    choices: [-1, 0, 1],
  };

  const index = 1;
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBe(specs.choices![index]);
});

test("should be negative", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Negative,
  };

  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeLessThan(0);
});

test("should be positive", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Positive,
  };

  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeGreaterThanOrEqual(0);
});

test("should be negative with indifferent sign", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Indifferent,
  };

  randomMock.mockReturnValue(constant.SIGN_CHANGE + 0.05);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeLessThan(0);
});

test("should be positive with indifferent sign", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Indifferent,
  };

  randomMock.mockReturnValue(constant.SIGN_CHANGE - 0.05);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new FloatStrategy(specs).draw();
  expect(val).toBeGreaterThanOrEqual(0);
});

test("should respect max and min", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Positive,
    max: 0.5,
    min: 0.0001,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new FloatStrategy(specs).draw();

  const precision = constant.FLOAT_DEFAULTS.precision;
  expect(val).toEqual(addDecimals(expected, precision));
  const byNum = Math.pow(10, precision);
  expect(randomIntInclusiveMock.mock.calls).toEqual([
    [specs.max! * byNum, specs.min! * byNum],
  ]);
});

test("should respect precision", () => {
  const specs: Specs = {
    type: SchemaType.Float,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Positive,
    precision: 7,
    max: 0.0000002,
    min: 0.0000001,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new FloatStrategy(specs).draw();
  expect(val).toEqual(specs.max);
});
