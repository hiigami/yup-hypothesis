jest.unmock("../../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../../src/random";

import * as yup from "yup";

import { testXTimes } from "../utils";


test("should render an array", async () => {
  await testXTimes(yup.array().required(), 5);
  await testXTimes(yup.array().ensure(), 5);
  const TestSchema = yup.object({
    compact: yup
      .array(yup.string().nullable().oneOf(["", "1", "0", "4", null]))
      .compact()
      .max(5),
    sub: yup.array().of(yup.number().required()).min(2).max(5),
    sub2: yup.array(yup.date()).notRequired().max(5),
    sub3: yup.array(yup.boolean()).optional().max(5),
    sub4: yup.array(yup.boolean()).defined().max(5),
    sub5: yup.array(yup.object()).max(5),
    sub6: yup.array(yup.object({ one: yup.date() })).max(5),
    sub7: yup.array(yup.object({ two: yup.bool().required() })).max(5),
    sub8: yup
      .array(
        yup.object().oneOf([
          { a: 1, b: 2 },
          { c: 3, d: 4 },
        ])
      )
      .max(5),
  });
  await testXTimes(yup.array().of(TestSchema));
});
