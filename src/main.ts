import { AnySchema, InferType } from "yup";
import { Processor } from "./processor";

function example(schema: AnySchema): InferType<typeof schema> {
  const strategy = new Processor().run(schema);
  if (strategy === undefined) {
    return undefined as InferType<typeof schema>;
  }
  return strategy?.draw() as InferType<typeof schema>;
}

export default { example };
