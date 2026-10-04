// Spring Data JPA style Specifications on top of Prisma `where` inputs.
// A spec is just a where-fragment; `undefined` means "no condition" (like returning null in Spring),
// so optional filters can be composed without if/else chains.

type WhereLike<W> = {
  AND?: W | W[];
  OR?: W[];
  NOT?: W | W[];
};

export type Specification<W extends WhereLike<W>> = W | undefined;

const present = <W>(specs: (W | undefined)[]) => specs.filter((s): s is W => s !== undefined);

export const Specifications = {

  // All given specs must match. Undefined specs are ignored; none left → matches everything.
  allOf<W extends WhereLike<W>>(...specs: Specification<W>[]): W {
    const parts = present(specs);
    return (parts.length ? {AND: parts} : {}) as W;
  },

  // At least one spec must match. Undefined specs are ignored; none left → no condition.
  anyOf<W extends WhereLike<W>>(...specs: Specification<W>[]): Specification<W> {
    const parts = present(specs);
    return parts.length ? ({OR: parts} as W) : undefined;
  },

  not<W extends WhereLike<W>>(spec: Specification<W>): Specification<W> {
    return spec ? ({NOT: spec} as W) : undefined;
  }

};

// Make LIKE/ILIKE wildcards (% and _) and the escape char (\) match literally.
// Use it for user input passed to Prisma's contains / startsWith / endsWith.
export const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");
