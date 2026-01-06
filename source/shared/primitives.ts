import type { ReplaceAll } from "@toridoriv/toolkit";

import type { BuildTuple, Length } from "./collections.ts";

/**
 * Parses a string literal type into a number type if possible.
 *
 * @template T - The string literal type to parse.
 */
export type ParseInt<T> = T extends `${infer N extends number}` ? N : never;

/**
 * Converts a string literal type to camel case.
 *
 * @template T   - The string literal type to convert.
 * @template Sep - The separator used in the string literal type. Default is "-".
 */
export type CamelCase<
  T extends string,
  Sep extends string = "-",
> = T extends `${infer TPart}${Sep}${infer TRest}`
  ? `${Lowercase<TPart>}${Capitalize<CamelCase<TRest>>}`
  : Lowercase<T>;

/**
 * Trims all occurrences of a specified substring from a string literal type.
 *
 * @template T - The string literal type to trim.
 * @template U - The substring to remove. Default is a single space.
 */
export type Trim<T extends string, U extends string = " "> = ReplaceAll<T, U, "">;

/**
 * Represents an integer.
 *
 * @example
 *
 * ```typescript
 * type ValidInteger = Integer<3>; // 3
 * type AnotherValidInteger = Integer<-3>; // -3
 * type InvalidInteger = Integer<3.5>; // never
 * ```
 *
 */
export type Integer<N extends number> = `${N}` extends `${string}.${string}` ? never : N;

/**
 * Represents a positive integer.
 *
 * @example
 *
 * ```typescript
 * type ValidPositiveInteger = PositiveInteger<3>; // 3
 * type InvalidPositiveInteger = PositiveInteger<3.5>; // never
 * type AnotherInvalidPositiveInteger = PositiveInteger<-3>; // never
 * ```
 *
 */
export type PositiveInteger<N extends number> =
  Integer<N> extends never ? never : `${N}` extends `-${string}` ? never : N;

/**
 * Checks if a value is an integer.
 *
 * @example
 *
 * ```typescript
 * type CheckInteger1 = IsInteger<3>; // true
 * type CheckInteger2 = IsInteger<-3>; // true
 * type CheckInteger3 = IsInteger<3.5>; // false
 * ```
 *
 */
export type IsInteger<N extends number> = Integer<N> extends never ? false : true;

/**
 * Checks if a value is a positive integer.
 *
 * @example
 *
 * ```typescript
 * type CheckInteger1 = IsPositiveInteger<3>; // true
 * type CheckInteger2 = IsPositiveInteger<3.5>; // false
 * type CheckInteger3 = IsPositiveInteger<-3>; // false
 * ```
 *
 */
export type IsPositiveInteger<N extends number> =
  PositiveInteger<N> extends never ? false : true;

/**
 * Checks if two values are integers.
 *
 * @example
 *
 * ```typescript
 * type CheckIntegers1 = AreIntegers<3, 2>; // true
 * type CheckIntegers2 = AreIntegers<3, -3>; // true
 * type CheckIntegers3 = AreIntegers<3, 3.5>; // false
 * ```
 *
 */
export type AreIntegers<X extends number, Y extends number> =
  IsInteger<X> extends false ? false : IsInteger<Y> extends false ? false : true;

/**
 * Checks if two values are positive integers.
 *
 * @example
 *
 * ```typescript
 * type CheckIntegers1 = ArePositiveIntegers<3, 2>; // true
 * type CheckIntegers2 = ArePositiveIntegers<3.5, 3>; // false
 * type CheckIntegers3 = ArePositiveIntegers<3, -3>; // false
 * ```
 *
 */
export type ArePositiveIntegers<X extends number, Y extends number> =
  IsPositiveInteger<X> extends false
    ? false
    : IsPositiveInteger<Y> extends false
      ? false
      : true;

/**
 * Obtains the difference between two numbers.
 *
 * @example
 *
 * ```typescript
 * type ValidOperation = Subtract<5, 3>; // 2
 * type InvalidOperation = Subtract<3, 5>; // never
 * type AnotherInvalidOperation = Subtract<5, -3>; // never
 * ```
 *
 */
export type Subtract<X extends number, Y extends number> =
  ArePositiveIntegers<X, Y> extends false
    ? never
    : BuildTuple<X> extends [...infer A, ...BuildTuple<Y>]
      ? Length<A>
      : never;

/**
 * Obtains the sum between two numbers.
 *
 * @example
 *
 * ```typescript
 * type ValidOperation = Add<5, 3>; // 8
 * type InvalidOperation = Add<5, -3>; // never
 * ```
 *
 */
export type Add<X extends number, Y extends number> =
  ArePositiveIntegers<X, Y> extends false
    ? never
    : Length<[...BuildTuple<X>, ...BuildTuple<Y>]>;

/**
 * Adds 1 to a given value.
 *
 * @example
 *
 * ```typescript
 * type Value = Increment<2>; // 3
 * ```
 *
 */
export type Increment<N extends number> =
  IsPositiveInteger<N> extends false ? never : Add<N, 1>;

/**
 * Subtract 1 to a given value.
 *
 * @example
 *
 * ```typescript
 * type Value = Decrement<2>; // 1
 * ```
 *
 */
export type Decrement<N extends number> =
  IsPositiveInteger<N> extends false ? never : Subtract<N, 1>;

export type Abs<N extends number> = `${N}` extends `-${infer P extends number}` ? P : N;

export type AreNegativeIntegers<X extends number, Y extends number> =
  IsPositiveInteger<X> extends false
    ? IsPositiveInteger<Y> extends false
      ? true
      : false
    : false;
/**
 * Compares two numbers and returns true if the first number is larger than the second.
 *
 * @example
 *
 * ```typescript
 * type Larger = IsLargerThan<5, 3>; // true
 * type Smaller = IsLargerThan<3, 5>; // false
 * type Equals = IsLargerThan<5, 5>; // false
 * ```
 *
 */
export type IsLargerThan<X extends number, Y extends number> =
  Subtract<X, Y> extends never | 0 ? false : true;
