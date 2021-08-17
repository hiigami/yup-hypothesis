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
  const item: Record<string, unknown> = {};
  const handler = new FieldHandler();
  for (const x in schema.fields) {
    const field = schema.fields[x] as yup.AnySchema;
    const specs = new SchemaBuilder(field).specs();
    if (specs !== undefined && handler.canHandle(specs.presence)) {
      item[x] = handler.handle(specs) as [typeof x];
    }
  }
  return item as yup.InferType<typeof schema>;
}

export default { example };
