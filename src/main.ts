import { AnySchema, InferType } from "yup";

import { NOT_DEFINED } from "./config";
import { UnknownDict } from "./data/types";
import Processor from "./processor";

function example(
  schema: AnySchema,
  context?: UnknownDict
): InferType<typeof schema> {
  const strategy = Processor.getInstance().run(schema);
  const result = strategy?.draw({ context });
  return (result === undefined ? undefined : result.draw()) as InferType<
    typeof schema
  >;
}

export default { example };
