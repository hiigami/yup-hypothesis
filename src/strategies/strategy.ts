import { AnySchema } from "yup";

import { STRATEGY_DEFAULTS } from "../config";
import { specs as dSpecs, enumerations } from "../data";
import {
  DrawableConstructor,
  DrawableMapper,
  IDrawable,
} from "../data/drawable";
import { BaseSpecs } from "../data/specs";
import {
  ConditionalOptions,
  Field,
  Fields,
  StrategyArgs,
} from "../data/strategies";
import { Nullable } from "../data/types";
import { random, randomChoice, randomIntInclusive } from "../random";
import { reference } from "./common";

const NOTHING = Symbol("nothing");

export abstract class Strategy<T> {
  readonly schema: AnySchema;
  readonly specs: dSpecs.Specs;
  protected drawableMapper: DrawableMapper;

  constructor(args: StrategyArgs<BaseSpecs>, drawableMapper: DrawableMapper) {
    this.specs = args.specs;
    this.schema = args.schema;
    this.drawableMapper = drawableMapper;
  }
  protected _applyMutations(value: Nullable<T>): Nullable<T> {
    if (this.specs.mutations === undefined) {
      return value;
    }
    let mutated = value;
    for (const fn of this.specs.mutations) {
      mutated = fn.call(this.schema, mutated, value, this.schema) as T;
    }
    return mutated;
  }
  protected _choiceOrDraw(options?: ConditionalOptions): Nullable<T> {
    if (this.specs.choices.length > 0) {
      return this._drawChoice(options);
    }
    return this._draw(options);
  }
  protected _defaultOrNull() {
    if (this._shouldBeDefault()) {
      return this._getDefaultValue();
    }
    return this._shouldBeNull() ? null : NOTHING;
  }
  protected abstract _draw(options?: ConditionalOptions): T;
  protected _isExcluded(value: IDrawable) {
    for (const item of this.specs.exclude) {
      if (value.compare(item)) {
        return true;
      }
    }
    return false;
  }
  protected _random(max: number, min = 0): number {
    return randomIntInclusive(max, min);
  }
  private _getDefaultValue(): Nullable<T> {
    if (typeof this.specs.default === "function") {
      return this.specs.default() as Nullable<T>;
    }
    return this.specs.default as Nullable<T>;
  }
  private _shouldBeDefault() {
    if (
      this.specs.default !== undefined &&
      random() > STRATEGY_DEFAULTS.default
    ) {
      return true;
    }
    return false;
  }
  private _shouldBeNull() {
    if (this.specs.nullable && random() > STRATEGY_DEFAULTS.nullable) {
      return true;
    }
    return false;
  }
  protected _drawChoice(options?: ConditionalOptions): Nullable<T> {
    const choice = randomChoice<Nullable<T>>(
      this.specs.choices as Nullable<T>[]
    );
    if (reference.isRefObject(choice)) {
      return reference.resolve(choice.key, options) as Nullable<T>;
    }
    return choice;
  }
  private _drawAndValidate(
    drawable: DrawableConstructor,
    options?: ConditionalOptions
  ) {
    let drawValue = this._choiceOrDraw(options);
    let rawValue = this._applyMutations(drawValue);
    let value = new drawable(rawValue, this.specs.strict ?? false);
    while (this._isExcluded(value)) {
      drawValue = this._choiceOrDraw(options);
      rawValue = this._applyMutations(drawValue);
      value = new drawable(rawValue, this.specs.strict ?? false);
    }
    return value;
  }
  draw(options?: ConditionalOptions) {
    const result = this._defaultOrNull();
    const name = this.constructor.name.toLowerCase().replace("strategy", "");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const drawable = this.drawableMapper.get(name)!;
    if (drawable === undefined) {
      console.error(name);
    }
    if (result !== NOTHING) {
      return new drawable(result, this.specs.strict ?? false);
    }
    return this._drawAndValidate(drawable, options);
  }
  getPresence() {
    return this.specs.presence;
  }
  isDefined(): boolean {
    if (this.specs.presence === enumerations.PresenceType.Optional) {
      return random() > STRATEGY_DEFAULTS.defined;
    }
    return true;
  }
}

export abstract class StrategyNestedFields<
  A,
  B extends BaseSpecs,
  C = Fields | Field
> extends Strategy<A> {
  protected fields;
  constructor(
    args: StrategyArgs<B> & { fields?: C },
    drawableMapper: DrawableMapper
  ) {
    super(args, drawableMapper);
    this.fields = args.fields;
  }
}
