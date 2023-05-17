import { is } from "../common";
import { handlers } from "../data";
import { IHandler, Reference } from "../data/handlers";
import { Field, Fields } from "../data/strategies";
import { ReferenceStrategy } from "../strategies";

export class ReferenceHandler implements IHandler {
  canHandle(t: unknown): boolean {
    if (is<Reference, unknown>(t as Reference, "key", "path")) {
      return true;
    }
    return false;
  }
  getFields(_schema: unknown): handlers.Schemas {
    return undefined;
  }
  handle(ref: Reference, _fields?: Fields): Field {
    return new ReferenceStrategy({ path: ref.path, isContext: ref.isContext });
  }
}
