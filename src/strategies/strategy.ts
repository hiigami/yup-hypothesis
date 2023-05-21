import { AnySchema } from "yup";

import { STRATEGY_DEFAULTS } from "../config";
import { specs as dSpecs, enumerations } from "../data";
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

interface Result<T> {
  apply: boolean;
  value: Nullable<T>;
}

function createResult<T>(apply: boolean, value: Nullable<T> = null): Result<T> {
  return {
    apply: apply,
    value: value,
  };
}

export abstract class Strategy<T> {
  readonly schema: AnySchema;
  readonly specs: dSpecs.Specs;

  constructor(args: StrategyArgs<BaseSpecs>) {
    this.specs = args.specs;
    this.schema = args.schema;
  }
  protected _applyStrictness(value: T): T {
    return value;
  }
  protected abstract _draw(options?: ConditionalOptions): T;
  protected _random(max: number, min = 0): number {
    return randomIntInclusive(max, min);
  }
  private _getDefaultValue(): Nullable<T> {
    if (typeof this.specs.default === "function") {
      return this.specs.default() as Nullable<T>;
    }
    return this.specs.default as Nullable<T>;
  }
  private _shouldBeDefault(): Result<T> {
    if (
      this.specs.default !== undefined &&
      random() > STRATEGY_DEFAULTS.default
    ) {
      return createResult(true, this._getDefaultValue());
    }
    return createResult(false);
  }
  private _shouldBeNull(): Result<T> {
    if (this.specs.nullable && random() > STRATEGY_DEFAULTS.nullable) {
      return createResult(true);
    }
    return createResult(false);
  }
  private _defaultOrNull(): Result<T> {
    const defaultResult = this._shouldBeDefault();
    if (defaultResult.apply) {
      return defaultResult;
    }
    return this._shouldBeNull();
  }
  private _drawChoice(options?: ConditionalOptions): Nullable<T> {
    const choice = randomChoice<Nullable<T>>(
      this.specs.choices as Nullable<T>[]
    );
    if (reference.isRefObject(choice)) {
      return reference.resolve(choice.key, options) as Nullable<T>;
    }
    return choice;
  }
  private _choiceOrDraw(options?: ConditionalOptions): Nullable<T> {
    if (this.specs.choices && this.specs.choices.length > 0) {
      return this._drawChoice(options);
    }
    return this._draw(options);
  }
  private _applyMutations(value: Nullable<T>): Nullable<T> {
    if (this.specs.mutations === undefined) {
      return value;
    }
    let mutated = value;
    for (const fn of this.specs.mutations) {
      mutated = fn.call(this.schema, mutated, value, this.schema) as T;
    }
    return mutated;
  }
  isDefined(): boolean {
    if (this.specs.presence === enumerations.PresenceType.Optional) {
      return random() > STRATEGY_DEFAULTS.defined;
    }
    return true;
  }
  draw(options?: ConditionalOptions): Nullable<T> {
    const result = this._defaultOrNull();
    if (result.apply) {
      return result.value;
    }
    const drawValue = this._choiceOrDraw(options);
    const value = this._applyMutations(drawValue);
    return value === undefined ? value : this._applyStrictness(value as T);
  }
}

export abstract class StrategyWithFields<
  A,
  B extends BaseSpecs,
  C = Fields | Field
> extends Strategy<A> {
  protected fields;
  constructor(args: StrategyArgs<B> & { fields?: C }) {
    super(args);
    this.fields = args.fields;
  }
}
