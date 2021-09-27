import { AnySchema } from "yup";
import Condition from "yup/lib/Condition";

import { PresenceType } from "../data/enumerations";
import { BaseSpecs } from "../data/specs";
import { ConditionalOptions, IStrategy } from "../data/strategies";
import Processor from "../processor";

import { NOT_DEFINED } from "./constant";
import { Strategy } from "./strategy";

export class ConditionalStrategy extends Strategy<unknown> {
  private conditions: Condition[];
  private depends: string[];
  constructor(specs: BaseSpecs, schema: AnySchema) {
    super(specs, schema);
    this.conditions = this.schema["conditions"] as Condition[];
    this.depends = this.conditions.map((c) => c.refs.map((r) => r.key)).flat();
  }
  private _drawWithParent(
    strategy?: IStrategy,
    options?: ConditionalOptions
  ): unknown {
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
  draw(options?: ConditionalOptions): unknown {
    const schema = this._draw(options);
    const strategy = Processor.getInstance().run(schema);
    if (options?.parent) {
      return this._drawWithParent(strategy, options);
    }
    return strategy?.draw(options);
  }
}
