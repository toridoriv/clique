// import * as cliffy from "@cliffy/command";
// import type { ReplaceAll } from "@toridoriv/toolkit";

// import type { MergeOptions } from "../node_modules/@cliffy/command/_argument_types.ts";

// new cliffy.Command().option("asd <value:string>", "desc");

// export type Flag = {
//   /**
//    * @example
//    *
//    * --first-name <value:string>
//    *
//    */
//   definition: string;
//   // name: string;
//   description: string;
//   // type: "string" | "number" | "boolean";
//   collect?: boolean;
//   conflicts?: string[];
// };

// // export type AsOption<T extends Flag>

// export type CamelCase<TValue extends string> =
//   TValue extends `${infer TPart}_${infer TRest}`
//     ? `${Lowercase<TPart>}${Capitalize<CamelCase<TRest>>}`
//     : TValue extends `${infer TPart}-${infer TRest}`
//       ? `${Lowercase<TPart>}${Capitalize<CamelCase<TRest>>}`
//       : Lowercase<TValue>;

// type Options<T extends Flag[]> = {
//   // [K in T[number]]
// };

// type GetOptionName<TFlags> = TFlags extends `${string}--${infer Name}=${string}`
//   ? Trim<Name, ",">
//   : TFlags extends `${string}--${infer Name} ${string}`
//     ? Trim<Name, ",">
//     : TFlags extends `${string}--${infer Name}`
//       ? Name
//       : TFlags extends `-${infer Name}=${string}`
//         ? Trim<Name, ",">
//         : TFlags extends `-${infer Name} ${string}`
//           ? Trim<Name, ",">
//           : TFlags extends `-${infer Name}`
//             ? Name
//             : never;

// type ExtractArgumentsFromFlags<TFlags extends string> =
//   TFlags extends `-${string}=${infer RestFlags}`
//     ? ExtractArgumentsFromFlags<RestFlags>
//     : TFlags extends `-${string} ${infer RestFlags}`
//       ? ExtractArgumentsFromFlags<RestFlags>
//       : TFlags;

// type OptionName<Name extends string> = Name extends "*"
//   ? string
//   : CamelCase<Trim<Name, ",">>;

// export type Trim<T extends string, U extends string = " "> = ReplaceAll<T, U, "">;

// type X<T extends string, N extends GetOptionName<T> = GetOptionName<T>> = {
//   name: N;
//   args: ExtractArgumentsFromFlags<"-f, --first-name <value:string>">;
//   optionName: OptionName<N>;
// };

// export type Y = X<"-f, --first-name <value:string>">;
