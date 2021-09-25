import { AnySchema, InferType } from "yup";

import { Dict } from "./data/types";
import Processor from "./processor";
import { NOT_DEFINED } from "./strategies/constant";

function example(
  schema: AnySchema,
  context?: Dict<unknown>
): InferType<typeof schema> {
  const strategy = Processor.getInstance().run(schema);
  const result = strategy?.draw({ context });
  return (result === NOT_DEFINED ? undefined : result) as InferType<
    typeof schema
  >;
}

export default { example };
