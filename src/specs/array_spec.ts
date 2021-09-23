import { PresenceType, SchemaType, TestParameter } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Maybe } from "../data/types";

import { minByPresence } from "./utils/common";
import { Spec } from "./spec";

export class ArraySpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Array;
  }
  private _getMin(presence: PresenceType): Maybe<number> {
    const min = this.testSearch.getParameter<number>(TestParameter.Min);
    if (minByPresence(presence, min)) {
      return 1;
    }
    return min;
  }
  get(): Specs {
    const specs = this._get();
    specs.length = this.testSearch.getParameter(TestParameter.Length);
    specs.min = this._getMin(specs.presence);
    specs.max = this.testSearch.getParameter<number>(TestParameter.Max);
    return specs;
  }
}
