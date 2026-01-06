import { coerce } from "@toridoriv/toolbox";

import type { Push } from "../shared/collections.ts";
import { Flag } from "./flag.ts";

export namespace Command {
  export type AnyCommand = Command<Flag.AnyFlag[]>;

  export type FlagsOf<C> = C extends Command<infer F> ? F : never;

  export type OptionsOf<C> = Flag.ToOptions<FlagsOf<C>>;
}

export class Command<Flags extends Flag.AnyFlag[] = []> {
  constructor(
    public readonly name: string,
    public readonly flags: Flags = coerce([]),
  ) {}

  public option<
    T extends Flag.Definition,
    Collect extends boolean = false,
    Conflicts extends string[] = string[],
  >(
    definition: T,
    description: string,
    collect?: Collect,
    conflicts?: Conflicts,
  ): Command<Push<Flags, Flag<T, Collect, Conflicts>>>;
  public option<
    T extends Flag.Definition,
    Collect extends boolean = false,
    Conflicts extends string[] = string[],
  >(
    definition: Flag<T, Collect, Conflicts>,
    ...args: [description: string, collect?: Collect, conflicts?: Conflicts]
  ): Command<Push<Flags, Flag<T, Collect, Conflicts>>> {
    if (!(definition instanceof Flag)) {
      // @ts-ignore: ¯\_(ツ)_/¯
      return this.option<T, Collect, Conflicts>(new Flag(definition, ...args));
    }

    this.flags.push(definition);

    return coerce(this);
  }
}
