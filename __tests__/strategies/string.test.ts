import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { createSpecs } from "../utils";
import { StringStrategy } from "../../src/strategies";

test("should be a string", () => {
  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new StringStrategy({
    specs: createSpecs(),
    schema: yup.string().required(),
  }).draw();

  expect(typeof val).toEqual("string");
});
