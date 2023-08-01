export interface IDrawable {
  compare(a: unknown): boolean;
  draw(): any;
}

export interface DrawableConstructor {
  new (value: any, strict: boolean): IDrawable;
}

export type DrawableMapper = Map<string, DrawableConstructor>;
