import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { Specs } from "../../src/data";
import { PresenceType, SchemaType } from "../../src/data/enumerations";
import { BooleanStrategy } from "../../src/strategies";
import * as constant from "../../src/strategies/constant";

test("should be bool", () => {
  const specs: Specs = {
    type: SchemaType.Boolean,
    nullable: false,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new BooleanStrategy(specs).draw();
  expect(typeof val).toEqual("boolean");
});

test("should be nullable", () => {
  const specs: Specs = {
    type: SchemaType.Boolean,
    nullable: true,
    presence: PresenceType.Required,
  };

  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new BooleanStrategy(specs).draw();
  expect(val).toBeNull();
});

test("should be default", () => {
  const specs: Specs = {
    type: SchemaType.Boolean,
    nullable: true,
    presence: PresenceType.Required,
    default: false,
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new BooleanStrategy(specs).draw();
  expect(val).toBe(specs.default);
});

test("should be one of", () => {
  const specs: Specs = {
    type: SchemaType.Boolean,
    nullable: false,
    presence: PresenceType.Required,
    choices: [false, true, false],
  };

  const index = 1;
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new BooleanStrategy(specs).draw();
  expect(val).toBe(specs.choices![index]);
});
