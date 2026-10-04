/**
 * Created by WebStorm.
 * User: Mehedi Hasan
 * Date: 10/4/26
 * Time: 11:43 AM
 * Email: mdmehedihasanroni28@gmail.com
 */

import {prisma} from "../../lib/prisma.js";
import {Prisma} from "../../generated/prisma/client.js";
import {toPage, toPrismaPaging} from "../../lib/pagination.js";
import {CreateUserDto, UpdateUserDto, UserPageable} from "./user.dto.js";

export const userRepository = {

  findByEmail: (email: string) => prisma.user.findUnique({where: {email}}),
  findById: (id: number) => prisma.user.findUnique({where: {id}}),

  async findAll(where: Prisma.UserWhereInput, pageable: UserPageable) {

    const [content, total] = await prisma.$transaction([
      prisma.user.findMany({where, ...toPrismaPaging(pageable)}),
      prisma.user.count({where})
    ]);

    return toPage(content, total, pageable);

  },

  create: (data: CreateUserDto) => prisma.user.create({data}),
  update: (id: number, data: UpdateUserDto) => prisma.user.update({where: {id}, data})

}
