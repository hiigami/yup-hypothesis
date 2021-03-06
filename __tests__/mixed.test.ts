// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as yup from "yup";

import * as rnd from "../src/random";
import { testXTimes } from "./utils";

jest.unmock("../src/random");

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
    mixed_req_not_null: yup.mixed().nullable(false).required(),
  });
  await testXTimes(TestSchema);
});
