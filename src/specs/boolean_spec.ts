import { SchemaType, TestName, TestParameter } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Spec } from "./spec";

export class BooleanSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Boolean;
  }
  get(): Specs {
    const specs = this._get();
    const restrictionValue = this.testSearch.getParameter(
      TestParameter.Value,
      TestName.IsValue
    );
    if (restrictionValue !== undefined) {
      specs.choices?.push(
        (restrictionValue as string).toString().toLowerCase() === "true"
          ? true
          : false
      );
    }
    return specs;
  }
}
