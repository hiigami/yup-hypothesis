import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { BooleanStrategy } from "../../src/strategies";

test("should be bool", () => {
  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.Boolean,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);
  const val = new BooleanStrategy(specs, yup.boolean().required()).draw();
  expect(typeof val).toEqual("boolean");
});
