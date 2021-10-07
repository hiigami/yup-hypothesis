jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import { testXTimes } from "./utils";

const Context = { b: 5, cc: 4, t: true };

const TestSchema = yup.object({
  a: yup.number().positive().min(3).max(20),
  b: yup
    .number()
    .positive()
    .when("e.a", (a, schema) => {
      return a ? schema.min(3).max(a) : schema;
    }),
  c: yup
    .number()
    .positive()
    .required()
    .when("d", {
      is: (a?: number) => a,
      then: yup.number().min(2),
      otherwise: yup.number().min(10),
    }),
  d: yup
    .number()
    .positive()
    .when("a", {
      is: (a?: number) => a,
      then: yup.number().min(2),
      otherwise: yup.number().min(10),
    }),
  e: yup.object({
    a: yup
      .number()
      .positive()
      .when(["$b", "$cc"], {
        is: (b?: number, c?: number): boolean => {
          return Number.isInteger(c) && Number.isInteger(b);
        },
        then: yup.number().required().min(3).max(20),
        otherwise: yup.number().optional().nullable().min(20).max(100),
      }),
    r: yup.array().of(
      yup
        .number()
        .when("$t", {
          is: true,
          then: yup.number().positive(),
          otherwise: yup.number().negative(),
        })
        .max(5)
    ),
  }),
});

test("should apply conditionals in non array or object schema", async () => {
  const TestStringSchema = yup.string().when("$t", {
    is: true,
    then: yup.string().nullable(),
    otherwise: yup.string().oneOf(["a", "b"]),
  });
  await testXTimes(TestStringSchema, 5);
  await testXTimes(TestStringSchema, 5, Context);
});

test("should apply conditionals in object", async () => {
  await testXTimes(TestSchema, 40);
  await testXTimes(TestSchema, 40, Context);
});

test("should apply conditionals in array elements", async () => {
  const TestArraySchema = yup.array().of(TestSchema).max(20);
  await testXTimes(TestArraySchema, 10);
  await testXTimes(TestArraySchema, 10, Context);
});