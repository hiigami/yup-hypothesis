import { AnySchema } from "yup";

import { is } from "../common";
import { NOT_DEFINED } from "../config";
import { IDrawable } from "../data/drawable";
import { PresenceType } from "../data/enumerations";
import { BaseSpecs } from "../data/specs";
import {
  ConditionalOptions,
  IStrategy,
  StrategyArgs,
} from "../data/strategies";
import { DrawableGeneric } from "../drawable";
import Processor from "../processor";
import { Strategy } from "./strategy";

type Condition = AnySchema["conditions"];

function toDrawable(item: any) {
  if (is<typeof item, IDrawable>(item, "type", "value")) {
    return item;
  }
  return new DrawableGeneric(typeof item, item, false);
}

export class ConditionalStrategy extends Strategy<unknown> {
  private conditions: Condition[];
  private depends: string[];
  constructor(args: StrategyArgs<BaseSpecs>) {
    super(args, new Map());
    this.conditions = this.schema["conditions"] as Condition[];
    this.depends = this.conditions
      .map((c) => c.refs.map((r: { key: unknown }) => r.key))
      .flat();
  }
  private _drawWithParent(strategy?: IStrategy, options?: ConditionalOptions) {
    const isDefined = this.isDefined() || strategy?.isDefined();
    return isDefined ? strategy?.draw(options) : NOT_DEFINED;
  }
  protected _draw(options?: ConditionalOptions): AnySchema {
    let schema = this.schema;
    for (const c of this.conditions) {
      schema = c.resolve(schema, options || {});
    }
    schema["conditions"] = [];
    return schema;
  }
  isDefined(): boolean {
    if (this.specs.presence === PresenceType.Optional) {
      return false;
    }
    return true;
  }
  dependsOn(): string[] {
    return this.depends;
  }
  draw(options?: ConditionalOptions) {
    const schema = this._draw(options);
    const strategy = Processor.getInstance().run(schema);
    if (options?.parent) {
      return toDrawable(this._drawWithParent(strategy, options));
    }
    return strategy?.draw(options);
  }
}
