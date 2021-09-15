import { AnySchema } from "yup";

import { Specs } from "./specs";
export interface IStrategy {
  isDefined(): boolean;
  draw(): unknown;
}
export interface StrategyConstructor {
  new (specs: Specs, schema: AnySchema): IStrategy;
}
