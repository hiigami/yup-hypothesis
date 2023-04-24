import { ArraySpecs } from "../data/specs";
import {
  ConditionalOptions,
  Field,
  Fields,
  StrategyArgs,
} from "../data/strategies";
import { Strategy } from "./strategy";

type List = unknown[];

function getValue(field: Field, options?: ConditionalOptions) {
  if (field?.isDefined()) {
    return field?.draw(options);
  }
  return undefined;
}

export class TupleStrategy extends Strategy<List> {
  private fields;
  constructor(args: StrategyArgs<ArraySpecs> & { fields?: Fields }) {
    super(args);
    this.fields = args.fields;
  }
  protected _draw(options?: ConditionalOptions): List {
    const items: List = [];
    if (this.fields !== undefined) {
      const keys = Object.keys(this.fields).sort();
      for (const key of keys) {
        items.push(getValue(this.fields[key], options));
      }
    }
    return items;
  }
}
