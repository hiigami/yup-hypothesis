import { IStrategy } from "../data/strategies";
import { ConditionalOptions } from "../data/strategies";
import { resolvePath } from "./common/reference";

export class ReferenceStrategy implements IStrategy {
  private path;
  readonly isContext;
  constructor(args: { path: string; isContext: boolean }) {
    this.path = args.path;
    this.isContext = args.isContext;
  }
  isDefined(): boolean {
    return true;
  }
  private _draw(options?: ConditionalOptions) {
    if (options?.parent !== undefined) {
      return resolvePath(this.path, options.parent as never);
    }
    return undefined;
  }
  public draw(options?: ConditionalOptions): unknown {
    if (this.isContext && options?.context !== undefined) {
      return resolvePath(this.path, options.context as never);
    }
    return this._draw(options);
  }
}
