import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { createSpecs } from "../utils";

import { enumerations } from "../../src/data";
import { BooleanStrategy } from "../../src/strategies";

test("should be bool", () => {
  const specs = createSpecs({ type: enumerations.SchemaType.Boolean });

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);
  const val = new BooleanStrategy({
    specs,
    schema: yup.boolean().required(),
  }).draw();

  expect(typeof val).toEqual("boolean");
});
