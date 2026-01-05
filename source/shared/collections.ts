import type { ParseInt } from "./primitives.ts";

/**
 * Gets the index types of an array as a union of number literal types.
 *
 * @template T - The array type to get the index types from.
 */
export type IndexOf<T> = T extends any[] ? ParseInt<keyof T> : never;

/**
 * Converts an array type to an object type with its indexes as keys.
 *
 * @template T - The array type to convert.
 */
export type ArrayToObject<T extends unknown[]> = {
  [K in IndexOf<T>]: T[K];
};
