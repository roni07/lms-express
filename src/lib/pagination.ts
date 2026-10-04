// Spring Data style Pageable / Page.
// Query params: ?page=0&size=20&sort=name,asc&sort=email,desc  (page is 0-based, like Spring)

import {z} from "zod";

export type SortDirection = "asc" | "desc";

export type Pageable<F extends string = string> = {
  page: number;
  size: number;
  sort: {field: F; direction: SortDirection}[];
};

export type Page<T> = {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

type PageableOptions<F extends string> = {
  defaultSize?: number;
  maxSize?: number;
  defaultSort?: Pageable<F>["sort"];
};

// `sortable` is a whitelist so clients can't sort on arbitrary (or hidden) columns
export const pageableSchema = <const F extends string>(
  sortable: readonly [F, ...F[]],
  {defaultSize = 20, maxSize = 100, defaultSort = []}: PageableOptions<F> = {}
) => {

  const sortOrder = z.string()
    .transform((value) => {
      const [field, direction = "asc"] = value.split(",").map((part) => part.trim());
      return {field, direction: direction.toLowerCase()};
    })
    .pipe(z.object({
      field: z.enum(sortable),
      direction: z.enum(["asc", "desc"])
    }));

  // Blank values (`?page=`, `?sort=`) fall back to the defaults instead of failing validation
  const blankToUndefined = (value: unknown) =>
    typeof value === "string" && value.trim() === "" ? undefined : value;

  return z.object({
    page: z.preprocess(blankToUndefined, z.coerce.number().int().min(0).default(0)),
    size: z.preprocess(blankToUndefined, z.coerce.number().int().min(1).max(maxSize).default(defaultSize)),
    // `?sort=a&sort=b` arrives as an array, a single `?sort=a` as a string
    sort: z.preprocess(
      (value) => {
        const values = [value].flat().filter((v) => blankToUndefined(v) !== undefined);
        return values.length ? values : undefined;
      },
      z.array(sortOrder).default(defaultSort)
    )
  }) satisfies z.ZodType<Pageable<F>>;

};

export const toPrismaPaging = <F extends string>({page, size, sort}: Pageable<F>) => ({
  skip: page * size,
  take: size,
  orderBy: sort.map(({field, direction}) => ({[field]: direction}) as Partial<Record<F, SortDirection>>)
});

export const toPage = <T>(content: T[], totalElements: number, {page, size}: Pageable): Page<T> => {

  const totalPages = Math.ceil(totalElements / size);

  return {
    content,
    page: {
      number: page,
      size,
      totalElements,
      totalPages,
      hasNext: page + 1 < totalPages,
      hasPrevious: page > 0
    }
  };

};
