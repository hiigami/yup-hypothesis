import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { enumerations, specs as dSpecs } from "../../src/data";
import { StringStrategy } from "../../src/strategies";

test("should be a string", () => {
  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const specs: dSpecs.Specs = {
    type: enumerations.SchemaType.String,
    nullable: false,
    presence: enumerations.PresenceType.Required,
  };
  const val = new StringStrategy({
    specs,
    schema: yup.string().required(),
  }).draw();

  expect(typeof val).toEqual("string");
});
