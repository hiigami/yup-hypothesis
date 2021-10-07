import { AnySchema } from "yup";

import { BaseSpecs } from "./specs";
import { Dict, Maybe, UnknownDict } from "./types";

export type Field = Maybe<IStrategy>;
export type Fields = Dict<Field>;

export interface ConditionalOptions {
  value?: unknown;
  parent?: UnknownDict;
  context?: UnknownDict;
}

export interface IStrategy {
  isDefined(): boolean;
  draw(): unknown;
  draw(options?: ConditionalOptions): unknown;
}

export interface StrategyArgs extends UnknownDict {
  schema: AnySchema;
  specs: BaseSpecs;
}

export interface StrategyConstructor {
  new (args: StrategyArgs): IStrategy;
}
