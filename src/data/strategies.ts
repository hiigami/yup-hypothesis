export interface IStrategy {
  isDefined(): boolean;
  draw(): unknown;
}
export type Field = IStrategy | undefined;
export type Fields = Record<string, Field>;
