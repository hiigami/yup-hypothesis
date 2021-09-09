import { enumerations, specs as dSpecs } from "../data";
import { Spec } from "./types";
import * as common from "./common";

interface TypeMapper {
  readonly test: enumerations.TestName;
  readonly type: enumerations.SchemaType;
}

const typeMapper: TypeMapper[] = [
  {
    test: enumerations.TestName.Email,
    type: enumerations.SchemaType.Email,
  },
  {
    test: enumerations.TestName.URL,
    type: enumerations.SchemaType.URL,
  },
  {
    test: enumerations.TestName.UUID,
    type: enumerations.SchemaType.UUID,
  },
];

export class StringSpec extends Spec {
  protected _getType(): enumerations.SchemaType {
    for (const item of typeMapper) {
      if (this.testSearch.has(item.test)) {
        return item.type;
      }
    }
    return enumerations.SchemaType.String;
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
