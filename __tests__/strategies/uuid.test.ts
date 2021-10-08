/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { randomIntInclusiveMock, randomMock } from "../../jest.setup";

import * as yup from "yup";

import { createSpecs, uuidCheck } from "../utils";

import { enumerations } from "../../src/data";
import { UUIDStrategy } from "../../src/strategies";

test("should be uuid", () => {
  const specs = createSpecs({ type: enumerations.SchemaType.UUID });

  randomMock.mockReturnValue(0);
  randomIntInclusiveMock.mockReturnValue(1);

  const val = new UUIDStrategy({
    specs,
    schema: yup.string().uuid().required(),
  }).draw();

  expect(uuidCheck(val!)).toBeTruthy();
});
