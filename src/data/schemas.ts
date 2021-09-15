import { Specs } from "./specs";
import { Maybe } from "./types";

export interface ISchemaBuilder {
  specs(): Maybe<Specs>;
}
