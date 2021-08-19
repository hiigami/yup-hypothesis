/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

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

  const val = new BooleanStrategy(specs).draw();
  expect(typeof val).toEqual("boolean");
});
