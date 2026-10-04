import {Prisma} from "../../generated/prisma/client.js";
import {escapeLike, Specification, Specifications} from "../../lib/specification.js";
import {UserFilterDto} from "./user.dto.js";

type UserSpec = Specification<Prisma.UserWhereInput>;

export const userSpecs = {

  nameContains: (name?: string): UserSpec =>
    name ? {name: {contains: escapeLike(name), mode: "insensitive"}} : undefined,

  emailContains: (email?: string): UserSpec =>
    email ? {email: {contains: escapeLike(email), mode: "insensitive"}} : undefined,

  // Free-text search across name OR email
  search: (q?: string): UserSpec =>
    Specifications.anyOf(userSpecs.nameContains(q), userSpecs.emailContains(q)),

  fromFilter: (filter: UserFilterDto) =>
    Specifications.allOf<Prisma.UserWhereInput>(
      userSpecs.nameContains(filter.name),
      userSpecs.emailContains(filter.email),
      userSpecs.search(filter.q)
    )

};
