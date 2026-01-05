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
