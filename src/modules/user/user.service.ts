/**
 * Created by WebStorm.
 * User: Mehedi Hasan
 * Date: 9/29/26
 * Time: 3:21 PM
 * Email: mdmehedihasanroni28@gmail.com
 */

import {CreateUserDto, UpdateUserDto, UserFilterDto, UserPageable} from "./user.dto.js";
import {HttpError} from "../../middlewares/error.js";
import {hash} from "argon2";
import {userRepository} from "./user.repository.js";
import {userSpecs} from "./user.specification.js";

export const userService = {

  async createUser(dto: CreateUserDto) {

    const existing = await userRepository.findByEmail(dto.email);

    if (existing) throw new HttpError(409, "Email already in use");

    return userRepository.create({...dto, password: await hash(dto.password)});

  },

  getAllUsers(filter: UserFilterDto, pageable: UserPageable) {
    return userRepository.findAll(userSpecs.fromFilter(filter), pageable);
  },

  async findById(id: number) {

    const user = await userRepository.findById(id);

    if (!user) throw new HttpError(404, "User not found");

    return user;

  },

  async updateUser(id: number, dto: UpdateUserDto) {

    await this.findById(id);

    return userRepository.update(id, dto);

  }

}
