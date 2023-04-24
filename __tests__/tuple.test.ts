jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";
import { testXTimes } from "./utils";

test("should render a tuple", async () => {
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
    yup.object({one: yup.boolean(), two: yup.number().required()})
  ]);
  await testXTimes(TestSchema);
});

test("should render a tuple with different options", async () => {
  await testXTimes(yup.tuple([yup.string().label("name")]).optional());
  await testXTimes(yup.tuple([yup.string().label("name")]).required());
  await testXTimes(yup.tuple([yup.string().label("name")]).nonNullable());
  await testXTimes(yup.tuple([yup.string().label("name")]).notRequired());
  await testXTimes(yup.tuple([yup.string().label("name")]).defined());
});