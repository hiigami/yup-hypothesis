import { AnySchema } from "yup";

import { DrawableMapper, IDrawable } from "./drawable";
import { PresenceType } from "./enumerations";
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
  getPresence(): PresenceType;
  isDefined(): boolean;
  draw(): IDrawable;
  draw(options?: ConditionalOptions): IDrawable;
}

export interface StrategyArgs<T extends BaseSpecs> extends UnknownDict {
  schema: AnySchema;
  specs: T;
}

export interface StrategyConstructor {
  new <T extends BaseSpecs>(
    args: StrategyArgs<T>,
    drawableMapper: DrawableMapper
  ): IStrategy;
}
