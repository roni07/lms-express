/**
 * Created by WebStorm.
 * User: Mehedi Hasan
 * Date: 9/29/26
 * Time: 3:22 PM
 * Email: mdmehedihasanroni28@gmail.com
 */

import {Router} from "express";
import * as userController from "./user.controller.js";

export const userRoutes = Router();

userRoutes.post("/create", userController.createUser);
userRoutes.get("/all", userController.getAllUsers);
userRoutes.get("/get-by-id/:id", userController.getUserById);
userRoutes.put("/update/:id", userController.updateUser);
