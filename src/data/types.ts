export type Dict<T> = Record<string, T>;
export type GenericFn<T> = () => T;
export type Maybe<T> = T | undefined;
export type Nullable<T> = T | null;
export type ReadOnlyArray<T> = readonly T[];
export type UnknownDict = Dict<unknown>;
