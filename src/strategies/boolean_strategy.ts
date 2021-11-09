import { NotStrict } from "../data/types";
import { randomChoice } from "../random";

import { applyStrictness, randomBoolean } from "./common/general";
import { Strategy } from "./strategy";

type NotStrictBoolean = NotStrict<boolean | number>;

function asNotStrict(val: boolean): NotStrictBoolean {
  if (val) {
    return randomChoice([true, 1, "true", "1"]);
  }
  return randomChoice([false, 0, "false", "0"]);
}

export class BooleanStrategy extends Strategy<NotStrictBoolean> {
  protected _applyStrictness(val: boolean): NotStrictBoolean {
    return applyStrictness(val, asNotStrict, this.specs.strict);
  }
  protected _draw(): NotStrictBoolean {
    return randomBoolean();
  }
}
