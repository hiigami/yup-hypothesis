jest.unmock("../../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../../src/random";

import * as yup from "yup";
import { testXTimes } from "../utils";

const Context = { bb: 5, cc: 4, t: true };

test("should apply reference in object schema", async () => {
  const TestSchema = yup.object({
    a: yup.ref("d"),
    b: yup.string().oneOf([yup.ref("c"), "t"]),
    c: yup.string(),
    d: yup.ref("e.o[3]"),
    e:yup.object({
      j: yup.ref("$cc"),
      kl_mn: yup.number().positive().min(3).max(20),
      o: yup.array(yup.bool()).max(5),
    }).camelCase(),
    f: yup
    .number()
    .positive()
    .when("e.kl_mn", (values, schema) => {
      const val = values[0];
      return val === undefined || val === null
        ? schema
        : schema.min(3).max(val);
    }),
    g: yup.ref("h"),
    h: yup.ref("$bb"),
    i: yup.string().oneOf([yup.ref("b"), "t"]),
  });
  console.warn = jest.fn();
  await testXTimes(TestSchema, 15);
  await testXTimes(TestSchema, 15, Context);
});

test("should apply reference to context attribute in array schema using oneOf", async () => {
  const TestSchema = yup.array().oneOf([[yup.ref("$t"), 12], [1, "aa", true]]);
  console.warn = jest.fn();
  await testXTimes(TestSchema, 10);
  await testXTimes(TestSchema, 10, Context);
});

test("should apply reference to context attribute in mixed schema using oneOf", async () => {
  const TestSchema = yup.mixed().oneOf([yup.ref("$t"), yup.ref("$cc"), "aa", true]);
  console.warn = jest.fn();
  await testXTimes(TestSchema, 10);
  await testXTimes(TestSchema, 10, Context);
});
