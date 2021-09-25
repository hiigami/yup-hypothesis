import { AnySchema } from "yup";

import { BaseSpecs } from "../data/specs";
import { random } from "../random";

import { STRATEGY_DEFAULTS } from "./constant";
import { Strategy } from "./strategy";

export class BooleanStrategy extends Strategy<boolean> {
  constructor(specs: BaseSpecs, schema: AnySchema) {
    super(specs, schema);
  }
  protected _draw(): boolean {
    return random() < STRATEGY_DEFAULTS.bool;
  }
}
