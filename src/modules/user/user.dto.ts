/**
 * Created by WebStorm.
 * User: Mehedi Hasan
 * Date: 9/30/26
 * Time: 5:42 PM
 * Email: mdmehedihasanroni28@gmail.com
 */

import {z} from "zod";
import {pageableSchema} from "../../lib/pagination.js";

export const createUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(255),
  password: z.string().min(8).max(72),
  active: z.boolean().optional()
});

export const updateUserSchema = createUserSchema.omit({password: true}).partial();

// Route params arrive as strings, so `/users/42` must be coerced to a number
export const userIdSchema = z.coerce.number().int().positive();

// Blank query values (`?name=` or `?name=%20`) are treated as "not provided"
const optionalText = z.string().trim().transform((value) => value || undefined).optional();

export const userFilterSchema = z.object({
  name: optionalText,
  email: optionalText,
  q: optionalText
});

export const userPageableSchema = pageableSchema(["id", "name", "email"], {
  defaultSort: [{field: "name", direction: "asc"}]
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserFilterDto = z.infer<typeof userFilterSchema>;
export type UserPageable = z.infer<typeof userPageableSchema>;
