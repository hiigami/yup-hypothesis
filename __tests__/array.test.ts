jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import { testXTimes } from "./utils";

test("should render an array", async () => {
  await testXTimes(yup.array().required(), 5);
  await testXTimes(yup.array().ensure(), 5);
  await testXTimes(
    yup
      .array(yup.string().min(1).max(1))
      .oneOf([["a", "b", "c"], ["g", "h"], ["z"]])
  );
  const TestSchema = yup.object({
    compact: yup
      .array(yup.string().nullable().oneOf(["", "1", "0", "4", null]))
      .compact(),
    str: yup.string().required(),
    sub: yup.array().of(yup.number().required()).min(2).max(5),
    sub2: yup.array(yup.date()).notRequired(),
    sub3: yup.array(yup.boolean()).optional(),
    sub4: yup.array(yup.boolean()).defined(),
  });
  await testXTimes(yup.array().of(TestSchema));
});
