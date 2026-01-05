import type { Any } from "@toridoriv/toolbox";
import type { ReplaceAll } from "@toridoriv/toolkit";

import type { ArrayToObject } from "../shared/collections.ts";
import { CamelCase } from "../shared/primitives.ts";

export namespace Flag {
  /**
   * Maps base type names to their corresponding TypeScript types.
   */
  export type BaseTypeMapping = {
    string: string;
    number: number;
    boolean: boolean;
  };

  export type Properties = {
    definition: Definition;
  };

  /**
   * Converts an array of {@link Properties|flag properties} to an options object.
   *
   * @template Flags - The array of flag properties.
   */
  export type ToOptions<Flags extends Properties[]> = GetOptions<ArrayToObject<Flags>>;

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
      | TypeDescriptionOptional<TypeName>
      | TypeDescriptionRequired<TypeName>;

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
    export type ToOptionName<Def extends string> = CamelCase<ExtractName<Def>>;

    export type ToValueArgument<
      Def extends string,
      TypeMap extends Any.Object = BaseTypeMapping,
      Parsed extends ParseArgument<Def> = ParseArgument<Def>,
    > = Parsed["type"] extends keyof TypeMap
      ? Parsed["optional"] extends true
        ? TypeMap[Parsed["type"]] | undefined
        : TypeMap[Parsed["type"]]
      : never;

    type TypeDescriptionOptional<TypeName extends string = BaseType> =
      `[value:${TypeName}]`;

    type TypeDescriptionRequired<TypeName extends string = BaseType> =
      `<value:${TypeName}>`;

    type Trim<T extends string, U extends string = " "> = ReplaceAll<T, U, "">;

    type ExtractName<T> = T extends `${string}--${infer Name}=${string}`
      ? Trim<Name, ",">
      : T extends `${string}--${infer Name} ${string}`
        ? Trim<Name, ",">
        : T extends `${string}--${infer Name}`
          ? Name
          : T extends `-${infer Name}=${string}`
            ? Trim<Name, ",">
            : T extends `-${infer Name} ${string}`
              ? Trim<Name, ",">
              : T extends `-${infer Name}`
                ? Name
                : never;

    type ExtractArgValue<TFlags extends string> =
      TFlags extends `-${string}=${infer RestFlags}`
        ? ExtractArgValue<RestFlags>
        : TFlags extends `-${string} ${infer RestFlags}`
          ? ExtractArgValue<RestFlags>
          : TFlags;

    type ParseArgument<T extends string> = {
      type: T extends `${string}${"<" | "["}value:${infer TypeName}${">" | "]"}${string}`
        ? TypeName
        : never;
      optional: ExtractArgValue<T> extends TypeDescriptionOptional ? true : false;
    };
  }

  type GetOptions<
    T extends Record<number, Properties>,
    M extends Any.Object = BaseTypeMapping,
  > = {
    [K in keyof T as K extends number
      ? Definition.ToOptionName<T[K]["definition"]>
      : never]: T[K] extends Properties
      ? Definition.ToValueArgument<T[K]["definition"], M>
      : never;
  };
}

type X = Flag.ToOptions<
  [
    { definition: "-f, --first-name <value:string>" },
    { definition: "--age [value:number]" },
  ]
>;

type O = "-f, --first-name [value:number]";

type Y = Flag.Definition.ToValueArgument<O>;
