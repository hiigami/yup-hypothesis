import { NotStrict } from "../data/types";
import { randomChoice } from "../random";

import { randomBoolean } from "./common/general";
import { Strategy } from "./strategy";

function asNotStrict(val: boolean) {
  if (val) {
    return randomChoice([true, 1, "true", "1"]);
  }
  return randomChoice([false, 0, "false", "0"]);
}

type BooleanUnStrict = NotStrict<boolean | number>;

export class BooleanStrategy extends Strategy<BooleanUnStrict> {
  protected _applyStrictness(val: boolean): BooleanUnStrict {
    if (this.specs.strict) {
      return val;
    }
    return asNotStrict(val);
  }
  protected _draw(): BooleanUnStrict {
    return randomBoolean();
  }
}
