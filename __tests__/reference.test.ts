jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import { testXTimes } from "./utils";

const Context = { bb: 5, cc: 4, t: true };

test("should apply reference in object schema", async () => {
  const TestSchema = yup.object({
    a: yup.ref("d"),
    b: yup.string(),
    c: yup.ref("d.l[3]"),
    d:yup.object({
      g: yup.ref("$cc"),
      hiJk: yup.number().positive().min(3).max(20),
      l: yup.array(yup.bool()).max(5),
    }).camelCase(),
    e: yup
    .number()
    .positive()
    .when("d.hi_jk", (values, schema) => {
      const val = values[0];
      return val === undefined || val === null
        ? schema
        : schema.min(3).max(val);
    }),
    f: yup.ref("g"),
    g: yup.ref("$bb"),
  });
  console.warn = jest.fn();
  await testXTimes(TestSchema, 10);
  await testXTimes(TestSchema, 10, Context);
});

