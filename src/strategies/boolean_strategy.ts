import { randomBoolean } from "./common/general";
import { Strategy } from "./strategy";

export class BooleanStrategy extends Strategy<boolean> {
  protected _draw(): boolean {
    return randomBoolean();
  }
}
