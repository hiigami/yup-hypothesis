import { AnySchema } from "yup";

import { title } from "../common";
import { handlers } from "../data";
import { SchemaType } from "../data/enumerations";
import { Field, Fields, StrategyConstructor } from "../data/strategies";
import { schemaToStrategyMapper } from "../mapper";
import { typeToDrawableMapper } from "../mapper";
import { Handler } from "./handler";

export class FieldHandler extends Handler<handlers.Schemas> {
  canHandle(t: AnySchema): boolean {
    const key = title(t.type);
    const schemaType = SchemaType[key as keyof typeof SchemaType];
    return schemaToStrategyMapper.has(schemaType);
  }
  handle(schema: AnySchema, _fields?: Fields): Field {
    const specs = this.getSpecs(schema);
    if (specs === undefined) {
      return undefined;
    }
    const strategy = schemaToStrategyMapper.get(
      specs.type
    ) as StrategyConstructor;
    return new strategy({ specs, schema }, typeToDrawableMapper);
  }
}
