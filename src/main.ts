import * as yup from "yup";
import * as yupObject from "yup/lib/object";
import * as yupTypes from "yup/lib/types";

import { FieldHandler } from "./handler";
import { SchemaBuilder } from "./schema_builder";

function example<
  TShape extends yupObject.ObjectShape,
  TContext,
  TIn extends yupTypes.Maybe<yupObject.TypeOfShape<TShape>>,
  TOut extends yupTypes.Maybe<yupObject.AssertsShape<TShape>>
>(
  schema: yup.ObjectSchema<TShape, TContext, TIn, TOut>
): yup.InferType<typeof schema> {
  type objType = yup.InferType<typeof schema>;
  const item = {} as objType;
  const handler = new FieldHandler();
  for (const x in schema.fields) {
    const field = schema.fields[x] as yup.AnySchema;
    const specs = new SchemaBuilder(field).specs();
    if (handler.canHandle(specs.presence)) {
      // @ts-ignore
      item[x] = handler.handle(specs);
    }
  }
  return item;
}

export default { example };
