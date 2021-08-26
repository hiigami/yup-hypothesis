import { enumerations, specs as dSpecs } from "../data";
import { STRING_MUTATIONS } from "../mutation";
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
  private _getMutations(): dSpecs.SpecMutation[] {
    /**@todo create better logic */
    const mutations = [];
    for (const item of STRING_MUTATIONS) {
      const m = this.testSearch.getMutation(item.name, item.test);
      if (m !== undefined) {
        mutations.push(m);
      }
    }
    return mutations;
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
    specs.min = this._getMin(specs.presence);
    specs.max = this.testSearch.getParameter<number>(
      enumerations.TestParameter.Max
    );
    specs.mutations = this._getMutations();
    return specs;
  }
}
