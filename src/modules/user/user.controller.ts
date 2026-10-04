/**
 * Created by WebStorm.
 * User: Mehedi Hasan
 * Date: 9/29/26
 * Time: 3:21 PM
 * Email: mdmehedihasanroni28@gmail.com
 */

import {RequestHandler} from "express";
import {createUserSchema, updateUserSchema, userFilterSchema, userIdSchema, userPageableSchema} from "./user.dto.js";
import {userService} from "./user.service.js";

type IdParams = {id: string};

export const createUser: RequestHandler = async (req, res) => {

  const dto = createUserSchema.parse(req.body);

  const user = await userService.createUser(dto);

  res.status(201).json(user);

};

export const getAllUsers: RequestHandler = async (req, res) => {

  const filter = userFilterSchema.parse(req.query);
  const pageable = userPageableSchema.parse(req.query);

  const page = await userService.getAllUsers(filter, pageable);

  res.json(page);

}

export const getUserById: RequestHandler<IdParams> = async (req, res) => {

  const user = await userService.findById(userIdSchema.parse(req.params.id));

  res.json(user);

}

export const updateUser: RequestHandler<IdParams> = async (req, res) => {

  const dto = updateUserSchema.parse(req.body);

  const user = await userService.updateUser(userIdSchema.parse(req.params.id), dto);

  res.json(user);

}
