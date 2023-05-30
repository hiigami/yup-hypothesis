import { ObjectSchema } from "yup";

import { PresenceType, SchemaType } from "../data/enumerations";
import { Specs } from "../data/specs";
import { Fields } from "../data/strategies";
import { ReferenceStrategy } from "../strategies";
import { Spec } from "./spec";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectSchemaSpec = ObjectSchema<any, any, any, any>["spec"];

function emptyFields(item?: Fields) {
  return item !== undefined && Object.keys(item).length > 0;
}

export class ObjectSpec extends Spec {
  protected _getType(): SchemaType {
    return SchemaType.Object;
  }
  private _validatePresence(fields: Fields) {
    for (const k in fields) {
      if (
        !(fields[k] instanceof ReferenceStrategy) &&
        fields[k]?.getPresence() !== PresenceType.Optional
      ) {
        return PresenceType.Required;
      }
    }
    return PresenceType.Defined;
  }
  get(fields?: Fields): Specs {
    const specs = this._get();
    if (specs.presence === PresenceType.Optional && emptyFields(fields)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      specs.presence = this._validatePresence(fields!);
    }
    specs.noUnknown = (this.schema.spec as ObjectSchemaSpec).noUnknown;
    return specs;
  }
}
