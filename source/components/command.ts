export namespace Command {
  export type Flag = {
    definition: Flag.Definition;
    description: string;
    collect?: boolean;
    conflicts?: string[];
  };

  export namespace Flag {
    export type Definition = DefinitionWithoutShortName | DefinitionWithShortName;

    type DefinitionWithShortName = `-${string}, ${DefinitionWithoutShortName}`;

    type DefinitionWithoutShortName =
      `--${string}${DefinitionTypeSeparator}${DefinitionType}`;

    type DefinitionType = `<value:${TypeName}>` | `[value:${TypeName}]`;

    type Type = string | number | boolean;

    type TypeName = "string" | "number" | "boolean";

    type DefinitionTypeSeparator = " " | "=";
  }
}
