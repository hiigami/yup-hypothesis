export type Dict<T> = Record<string, T>;
export type GenericFn<T> = () => T;
export type GenericFnWithArg<A, B> = (x: A) => B;
export type Maybe<T> = T | undefined;
export type NotStrict<T> = T | string;
export type Nullable<T> = T | null;
export type ReadOnlyArray<T> = readonly T[];
export type UnknownDict = Dict<unknown>;
