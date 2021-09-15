import { enumerations, specs as dSpecs } from "../data";
import * as common from "./common";
import { Spec } from "./types";

export class ArraySpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    return enumerations.SchemaType.Array;
  }
  private _getMin(presence: enumerations.PresenceType): number | undefined {
    const min = this.testSearch.getParameter<number>(
      enumerations.TestParameter.Min
    );
    if (common.minByPresence(presence, min)) {
      return 1;
    }
    return min;
  }
  get(): dSpecs.Specs {
    const specs = this._get();
    specs.length = this.testSearch.getParameter(
      enumerations.TestParameter.Length
    );
    specs.min = this._getMin(specs.presence);
    specs.max = this.testSearch.getParameter<number>(
      enumerations.TestParameter.Max
    );
    return specs;
  }
}
