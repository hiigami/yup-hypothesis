import { ArraySchema } from "yup";

import { Specs } from "./specs";
import { Maybe } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArraySchemaAny = ArraySchema<any, any, any, any>;

export interface ISchemaBuilder {
  specs(): Maybe<Specs>;
}
