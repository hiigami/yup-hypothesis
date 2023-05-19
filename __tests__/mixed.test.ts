jest.unmock("../src/random");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rnd from "../src/random";

import * as yup from "yup";

import { testXTimes } from "./utils";


test("should render mixed", async () => {
  const TestSchema = yup.object({
    mixed: yup.mixed(),
    mixed_def: yup.mixed().defined(),
    mixed_def_null: yup.mixed().nullable().defined(),
    mixed_default: yup.mixed().default(0),
    mixed_not_req: yup.mixed().notRequired(),
    mixed_one_of: yup.mixed().oneOf([true, "we", 33.2]),
    mixed_opt: yup.mixed().optional(),
    mixed_req: yup.mixed().required(),
    mixed_req_not_null: yup.mixed().nonNullable().required(),
  });
  await testXTimes(TestSchema);
});

test("should render mixed when concat", async () => {
  const TestSchema = yup.mixed().concat(yup.mixed());
  await testXTimes(TestSchema);
});
