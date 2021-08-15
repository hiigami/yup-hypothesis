import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { Specs } from "../../src/data";
import { PresenceType, SchemaType, Sign } from "../../src/data/enumerations";
import { NumberStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be integer", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: false,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(Number.isInteger(val)).toBeTruthy();
});

test("should be nullable", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: true,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeNull();
});

test("should be default", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: true,
    presence: PresenceType.Required,
    default: -33,
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBe(specs.default);
});

test("should be one of", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: false,
    presence: PresenceType.Required,
    choices: [-1, 0, 1],
  };

  const index = 1;
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBe(specs.choices![index]);
});

test("should be negative", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Negative,
  };

  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeLessThan(0);
});

test("should be positive", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Positive,
  };

  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeGreaterThanOrEqual(0);
});

test("should be negative with indifferent sign", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Indifferent,
  };

  randomMock.mockReturnValue(constant.SIGN_CHANGE + 0.05);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeLessThan(0);
});

test("should be positive with indifferent sign", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Indifferent,
  };

  randomMock.mockReturnValue(constant.SIGN_CHANGE - 0.05);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBeGreaterThanOrEqual(0);
});

test("should respect max and min", () => {
  const specs: Specs = {
    type: SchemaType.Number,
    nullable: false,
    presence: PresenceType.Required,
    sign: Sign.Positive,
    max: 5,
    min: 3,
  };

  const expected = 2;
  randomIntInclusiveMock.mockReturnValue(expected);

  const val = new NumberStrategy(specs).draw();
  expect(val).toBe(expected);
  expect(randomIntInclusiveMock.mock.calls).toEqual([[specs.max, specs.min]]);
});
