/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { Strategy } from "../../src/strategies/base_strategies";
import * as constant from "../../src/strategies/constant";

class DummyStrategy extends Strategy<string> {
  protected _draw() {
    return "_draw";
  }
}

test("should return from _draw", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new DummyStrategy(specs).draw();
  expect(val).toEqual("_draw");
});

test("should be nullable", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: true,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(constant.IS_NULLABLE + 0.05);

  const val = new DummyStrategy(specs).draw();
  expect(val).toBeNull();
});

test("should be default", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: true,
    presence: enumerations.PresenceType.Required,
    default: "----",
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new DummyStrategy(specs).draw();
  expect(val).toBe(specs.default);
});

test("should handle default as function", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: true,
    presence: enumerations.PresenceType.Required,
    default: () => "----",
  };

  randomMock.mockReturnValue(constant.IS_DEFAULT + 0.05);

  const val = new DummyStrategy(specs).draw();
  expect(val).toBe((specs.default as dSpecs.DefaultFn)());
});

test("should be one of", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
    choices: ["a", "b", "c"],
  };

  const index = 2;
  randomIntInclusiveMock.mockReturnValue(index);

  const val = new DummyStrategy(specs).draw();
  expect(val).toBe(specs.choices![index]);
});
