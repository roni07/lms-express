import { Router } from "express";
import { userRoutes } from "./modules/user/user.routes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {

  res.set("Cache-Control", "no-store");
  res.json({
    message: "Library management API is running"
  })

});

apiRoutes.use("/users", userRoutes);
