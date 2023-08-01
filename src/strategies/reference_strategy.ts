import { PresenceType } from "../data/enumerations";
import { IStrategy } from "../data/strategies";
import { ConditionalOptions } from "../data/strategies";
import { Drawable, DrawableGeneric } from "../drawable";
import { resolvePath } from "./common/reference";

function toDrawable(item: any) {
  if (item instanceof Drawable) {
    return item;
  }
  return new DrawableGeneric(typeof item, item, false);
}

export class ReferenceStrategy implements IStrategy {
  private path;
  readonly isContext;
  constructor(args: { path: string; isContext: boolean }) {
    this.path = args.path;
    this.isContext = args.isContext;
  }
  getPresence(): PresenceType {
    return PresenceType.Defined;
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
  public draw(options?: ConditionalOptions) {
    if (this.isContext && options?.context !== undefined) {
      return toDrawable(resolvePath(this.path, options.context as never));
    }
    return toDrawable(this._draw(options));
  }
}
