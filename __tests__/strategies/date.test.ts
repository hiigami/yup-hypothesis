import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { Specs } from "../../src/data";
import { PresenceType, SchemaType } from "../../src/data/enumerations";
import { DateStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be date", () => {
  const specs: Specs = {
    type: SchemaType.Date,
    nullable: false,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new DateStrategy(specs).draw();
  expect(val).toBeInstanceOf(Date);
});

test("should be nullable", () => {
  const specs: Specs = {
    type: SchemaType.Date,
    nullable: true,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new DateStrategy(specs).draw();
  expect(val).toBeNull();
});

test("should be default", () => {
  const specs: Specs = {
    type: SchemaType.Date,
    nullable: true,
    presence: PresenceType.Required,
    default: false,
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new DateStrategy(specs).draw();
  expect(val).toBe(specs.default);
});

test("should be one of", () => {
  const specs: Specs = {
    type: SchemaType.Date,
    nullable: false,
    presence: PresenceType.Required,
    choices: [new Date(1), new Date(2), new Date(3)],
  };

  const index = 2;
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new DateStrategy(specs).draw();
  expect(val).toBe(specs.choices![index]);
});

test("should respect max and min", () => {
  const specs: Specs = {
    type: SchemaType.Date,
    nullable: false,
    presence: PresenceType.Required,
    min: new Date(4).getTime(),
    max: new Date(10).getTime(),
  };

  const expected = new Date(7);
  randomIntInclusiveMock.mockReturnValue(expected.getTime());

  const val = new DateStrategy(specs).draw();
  expect(val?.toISOString()).toBe(expected.toISOString());
  expect(randomIntInclusiveMock.mock.calls).toEqual([[specs.max, specs.min]]);
});
