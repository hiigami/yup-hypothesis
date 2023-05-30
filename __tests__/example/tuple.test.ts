jest.unmock("../../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../../src/random";

import * as yup from "yup";

import { testXTimes } from "../utils";


test("should render a tuple", async () => {
  const objectSchema = yup.object();
  const objectSchema1 = yup.object({ one: yup.boolean() });
  const objectSchema2 = objectSchema.shape({ two: yup.number().required() });
  const TestSchema = yup.tuple([
    yup
      .array(yup.string().nullable().oneOf(["", "1", "0", "4", null]))
      .compact(),
    yup.string().required(),
    yup.number().nullable(),
    yup.number().nonNullable(),
    yup.date().notRequired(),
    yup.boolean().optional(),
    yup.boolean().defined(),
    objectSchema,
    objectSchema.oneOf([
      { a: 1, b: 2 },
      { c: 3, d: 4 },
    ]),
    objectSchema1,
    objectSchema1.required(),
    objectSchema1.optional(),
    objectSchema2,
    objectSchema2.optional(),
  ]);
  await testXTimes(TestSchema);
});

test("should render a tuple with different options", async () => {
  const TestSchema = yup.object({
    tuple_optional: yup.tuple([yup.string().label("name")]).optional(),
    tuple_required: yup.tuple([yup.string().label("name")]).required(),
    tuple_non_nullable: yup.tuple([yup.string().label("name")]).nonNullable(),
    tuple_not_required: yup.tuple([yup.string().label("name")]).notRequired(),
    tuple_defined: yup.tuple([yup.string().label("name")]).defined(),
  });
  await testXTimes(TestSchema);
});

test("should render tuple when concat", async () => {
  const TestSchema = yup
    .tuple([yup.number(), yup.string()])
    .concat(yup.tuple([yup.date()]));
  await testXTimes(TestSchema);
});
