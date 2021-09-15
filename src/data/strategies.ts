import { AnySchema } from "yup";

import { Specs } from "./specs";
import { Dict, Maybe } from "./types";

export type Field = Maybe<IStrategy>;
export type Fields = Dict<Field>;

export interface IStrategy {
  isDefined(): boolean;
  draw(): unknown;
}

export interface StrategyConstructor {
  new (specs: Specs, schema: AnySchema): IStrategy;
}
