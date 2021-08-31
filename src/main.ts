import * as yup from "yup";
import * as yupObject from "yup/lib/object";
import * as yupTypes from "yup/lib/types";

import { ObjectHandler } from "./handler";

function example<
  TShape extends yupObject.ObjectShape,
  TContext,
  TIn extends yupTypes.Maybe<yupObject.TypeOfShape<TShape>>,
  TOut extends yupTypes.Maybe<yupObject.AssertsShape<TShape>>
>(
  schema: yup.ObjectSchema<TShape, TContext, TIn, TOut>
): yup.InferType<typeof schema> {
  const handler = new ObjectHandler();
  if (handler.canHandle(schema.type)) {
    return handler.handle(schema)?.draw() as yup.InferType<typeof schema>;
  }
  return undefined as yup.InferType<typeof schema>;
}

export default { example };
