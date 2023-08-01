import { DrawableConstructor } from "../data/drawable";
import * as d from "../drawable";

export const typeToDrawableMapper = new Map<string, DrawableConstructor>([
  ["string", d.DrawableString],
  ["email", d.DrawableString],
  ["url", d.DrawableString],
  ["uuid", d.DrawableString],
  ["array", d.DrawableArray],
  ["tuple", d.DrawableArray],
  ["number", d.DrawableNumber],
  ["float", d.DrawableNumber],
  ["date", d.DrawableDate],
  ["object", d.DrawableObject],
  ["boolean", d.DrawableBoolean],
]);
