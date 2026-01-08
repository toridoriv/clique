import type { Any as SafeAny, Merge } from "@toridoriv/toolbox";
import { coerce } from "@toridoriv/toolbox";

import type { ArrayToObject, ConflictingUnion } from "../shared/collections.ts";
import type { CamelCase, Trim } from "../shared/primitives.ts";

export namespace Flag {
  /**
   * A map of type names to their corresponding TypeScript types.
   */
  export type BaseTypeMapping = {
    string: string;
    number: number;
    boolean: boolean;
  };

  /**
   * Represents any {@link Flag|flag} instance.
   */
  export type Any = Flag<Flag.Definition, boolean>;

  /**
   * Converts an array of {@link Properties|flag properties} to an options object.
   *
   * @template Flags - The array of flag properties.
   */
  export type ToOptions<Flags extends Any[]> = ToDiscriminatedOptions<Flags>;

  export type ToDiscriminatedOptions<
    T extends SafeAny.Array,
    R extends SafeAny.Object = GetOptions<ArrayToObject<T>>,
  > = T extends []
    ? R
    : T extends [infer Head]
      ? Head extends Flag<infer Def, SafeAny, infer Conflicts>
        ? ConflictingUnion<R, Flag.Definition.ToOptionName<Def>, Conflicts[number]>
        : R
      : T extends [infer Head, ...infer Tail]
        ? Head extends Flag<infer Def, SafeAny, infer Conflicts>
          ? ToDiscriminatedOptions<
              Tail,
              ConflictingUnion<R, Flag.Definition.ToOptionName<Def>, Conflicts[number]>
            >
          : ToDiscriminatedOptions<Tail, R>
        : R;

  /**
   * Represents a flag definition. It can be a variant {@link Definition.WithoutShortName|without a short name}
   * or {@link Definition.WithShortName|with it}.
   *
   * @template Sep      - The separator between the flag name and type description.
   * @template TypeName - The name of the type for the flag value.
   */
  export type Definition<
    Sep extends string = " " | "=",
    TypeName extends string = Definition.BaseType,
  > =
    | Definition.WithShortName<Sep, TypeName>
    | Definition.WithoutShortName<Sep, TypeName>;

  export namespace Definition {
    /**
     * Represents a flag definition with a short name.
     *
     * @template Sep      - The separator between the flag name and type description.
     * @template TypeName - The name of the type for the flag value.
     * @example
     *
     * "-f, --first-name <value:string>"
     *
     */
    export type WithShortName<
      Sep extends string = " " | "=",
      TypeName extends string = BaseType,
    > = `-${string}, ${WithoutShortName<Sep, TypeName>}`;

    /**
     * Represents a flag definition without a short name.
     *
     * @template Sep      - The separator between the flag name and type description.
     * @template TypeName - The name of the type for the flag value.
     * @example
     *
     * "--first-name <value:string>"
     *
     */
    export type WithoutShortName<
      Sep extends string = " " | "=",
      TypeName extends string = BaseType,
    > = `--${string}${Sep}${TypeDescription<TypeName>}`;

    /**
     * Represents the base types for flag definitions.
     */
    export type BaseType = "string" | "number" | "boolean";

    /**
     * Represents the type description for flag definitions.
     *
     * @template TypeName - The name of the type for the flag value.
     * @example
     *
     * Required value.
     * "<value:string>"
     *
     * @example
     *
     * Optional value.
     * "[value:number]"
     *
     */
    export type TypeDescription<TypeName extends string = BaseType> =
      | TypeDescription.Optional<TypeName>
      | TypeDescription.Required<TypeName>;

    export namespace TypeDescription {
      /**
       * Represents a required type description for flag definitions.
       *
       * @template TypeName - The name of the type for the flag value.
       * @example
       *
       * "<value:string>"
       *
       */
      export type Required<TypeName extends string = BaseType> = `<value:${TypeName}>`;

      /**
       * Represents an optional type description for flag definitions.
       *
       * @template TypeName - The name of the type for the flag value.
       * @example
       *
       * "[value:string]"
       *
       */
      export type Optional<TypeName extends string = BaseType> = `[value:${TypeName}]`;
    }

    /**
     * Converts a flag definition string to its corresponding option name in camelCase.
     *
     * @example
     *
     * ```typescript
     * type OptionName = ToOptionName<"-f, --first-name <value:string>">; // "firstName"
     * ```
     *
     */
    export type ToOptionName<Def extends string> = CamelCase<ToName<Def>>;

    /**
     * Converts a flag definition string to its corresponding value type.
     *
     * @template Def         - The flag definition string.
     * @template TypeMap     - The type mapping for custom types.
     * @template Parsed      - An object type with information about the flag, like its type and whether it's optional.
     * @template FullTypeMap - The merged type mapping.
     */
    export type ToValueType<
      F extends Any,
      TypeMap extends SafeAny.Object = {},
      FullTypeMap extends SafeAny.Object = Merge<TypeMap, BaseTypeMapping>,
    > = GetOptionType<F, FullTypeMap>;

    /**
     * Extracts the flag name from a flag definition string.
     *
     * @template Def - The flag definition string.
     */
    export type ToName<Def> = Def extends `${string}--${infer Name}=${string}`
      ? Trim<Name, ",">
      : Def extends `${string}--${infer Name} ${string}`
        ? Trim<Name, ",">
        : Def extends `${string}--${infer Name}`
          ? Name
          : Def extends `-${infer Name}=${string}`
            ? Trim<Name, ",">
            : Def extends `-${infer Name} ${string}`
              ? Trim<Name, ",">
              : Def extends `-${infer Name}`
                ? Name
                : never;
    /**
     * Extracts the argument type description from a flag definition string.
     *
     * @template Def - The flag definition string.
     */
    export type ToArgDescription<Def extends string> =
      Def extends `-${string}=${infer RestFlags}`
        ? ToArgDescription<RestFlags>
        : Def extends `-${string} ${infer RestFlags}`
          ? ToArgDescription<RestFlags>
          : Def;
    /**
     * Parses a flag definition string to extract the type name and whether the argument is optional.
     *
     * @template Def - The flag definition string.
     */
    export type ParseArgument<Def extends string> = {
      type: Def extends `${string}${"<" | "["}value:${infer TypeName}${">" | "]"}${string}`
        ? TypeName
        : never;
      optional: ToArgDescription<Def> extends TypeDescription.Optional ? true : false;
    };
  }

  type GetOptionType<
    F extends Any,
    M extends SafeAny.Object,
    Parsed extends Definition.ParseArgument<F["definition"]> = Definition.ParseArgument<
      F["definition"]
    >,
    TypeName extends keyof M = Parsed["type"] extends keyof M ? Parsed["type"] : never,
    Type = F["collect"] extends true ? M[TypeName][] : M[TypeName],
  > = Parsed["optional"] extends true ? Type | undefined : Type;

  type GetOptions<
    T extends Record<number, Any>,
    M extends SafeAny.Object = BaseTypeMapping,
  > = {
    [K in keyof T as K extends number
      ? Definition.ToOptionName<T[K]["definition"]>
      : never]: T[K] extends Any ? Definition.ToValueType<T[K], M> : never;
  };
}

/**
 * Represents a command-line flag or option.
 *
 * @template T         - The flag definition type. @example "--first-name <value:string>"
 * @template Collect   - Indicates if the flag can collect multiple values. If so, the option value will be an array.
 * @template Conflicts - An array of flag names that conflict with this flag.
 */
export class Flag<
  T extends Flag.Definition,
  Collect extends boolean = false,
  Conflicts extends string[] = string[],
> {
  public constructor(
    /**
     * The flag definition string.
     *
     * @example
     *
     * "--first-name <value:string>"
     *
     */
    public readonly definition: T,
    /**
     * A brief description of the flag.
     */
    public description: string,
    /**
     * Indicates if the flag can collect multiple values. If so, the option value will be an array.
     */
    public readonly collect: Collect = false as Collect,
    /**
     * An array of flag names that conflict with this flag.
     */
    public readonly conflicts: Conflicts = coerce([]),
  ) {}
}
