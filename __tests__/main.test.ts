jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import { AnySchema } from "yup";

import yh from "../src/main";

test("should return undefined for unhandled schemas", () => {
  const val = yh.example({ type: "1234" } as AnySchema);
  expect(val).toEqual(undefined);
});
