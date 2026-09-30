/**
 * Created by WebStorm.
 * User: Mehedi Hasan
 * Date: 9/30/26
 * Time: 5:42 PM
 * Email: mdmehedihasanroni28@gmail.com
 */

import {z} from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email(),
  password: z.string().min(8).max(72)
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
