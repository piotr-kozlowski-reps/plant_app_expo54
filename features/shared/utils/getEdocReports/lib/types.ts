export type ISort<T> = "NONE" | keyof T | ((dataArray: T[]) => T[]);
export type TMapper<TIn, TOut> = "NONE" | ((propertyValue: TIn) => TOut);
