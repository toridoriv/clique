import type { Any, Expand } from "@toridoriv/toolbox";

import type {
  Decrement,
  IsLargerThan,
  IsPositiveInteger,
  ParseInt,
  Subtract,
} from "./primitives.ts";

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
export type ArrayToObject<T extends Any.Array> = {
  [K in IndexOf<T>]: T[K];
};

/**
 * Creates a union type that omits either key `K` or key `C` from the object type `T`.
 *
 * @template T - The object type.
 * @template K - The keys to omit in one variant of the union.
 * @template C - The keys to omit in the other variant of the union.
 */
export type ConflictingUnion<
  T extends Any.Object,
  K extends keyof T,
  C extends PropertyKey = string,
> = C extends keyof T ? Expand<Omit<T, C> | Omit<T, K>> : T;

/**
 * Creates a tuple where N is the desired length and optionally you can pass it an array of types to be filled. If the passed
 * array is smaller than expected length, the tuple will be filled with any.
 *
 * @example
 *
 * ```typescript
 * type Tuple = BuildTuple<2>; // [any, any]
 * type AnotherTuple = BuildTuple<3, [number, string]>; // [number, string, any]
 * ```
 *
 */
export type BuildTuple<N extends number, List extends Any.Array = []> =
  IsPositiveInteger<N> extends false
    ? never
    : List extends { length: N }
      ? List
      : BuildTuple<N, [...List, Any]>;

export type Push<T extends Any.Array, U> = [...T, U];

export type Length<T extends Any.Array> = T["length"];

/**
 * Implements {@link Array.slice} as a type.
 *
 * @example
 *
 * ```typescript
 * type Animals = ["ant", "bison", "camel", "duck", "elephant"];
 * type Example1 = Slice<Animals, 2>; // ["camel", "duck", "elephant"]
 * type Example2 = Slice<Animals, 2, 4>; // ["camel", "duck"]
 * type Example3 = Slice<Animals, 1, 5>; // ["bison", "camel", "duck", "elephant"]
 * type Example4 = Slice<Animals, -2>; // ["duck", "elephant"]
 * type Example5 = Slice<Animals, 2, -1>; // ["camel", "duck"]
 * type Example6 = Slice<Animals>; // ["ant", "bison", "camel", "duck", "elephant"]
 * ```
 *
 */
export type Slice<
  A extends Any.Array,
  Start extends number = 0,
  End extends number = A["length"],
> = Slice.RemoveHead<Slice.RemoveTail<A, End>, Start>;

/**
 * Commonly used types for {@link Slice}.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace Slice {
  type ParseEnd<N extends number, Len extends number> =
    IsLargerThan<N, Len> extends true
      ? 0
      : `${N}` extends `-${infer I extends number}`
        ? I
        : Subtract<Len, N>;

  type ParseStart<N extends number, Len extends number> =
    IsLargerThan<N, Len> extends true
      ? Len
      : `${N}` extends `-${infer I extends number}`
        ? Subtract<Len, I>
        : N;

  /**
   * Removes the last `N` elements from an array type.
   */
  export type RemoveTail<
    A extends Any.Array,
    N extends number,
    Parsed extends number = ParseEnd<N, A["length"]>,
  > = Parsed extends 0
    ? A
    : A extends [...infer H, any]
      ? RemoveTail<H, N, Decrement<Parsed>>
      : A;

  /**
   * Removes the first `N` elements from an array type.
   */
  export type RemoveHead<
    A extends Any.Array,
    N extends number,
    Parsed extends number = ParseStart<N, A["length"]>,
  > = Parsed extends 0
    ? A
    : A extends [any, ...infer T]
      ? RemoveHead<T, N, Decrement<Parsed>>
      : A;
}
