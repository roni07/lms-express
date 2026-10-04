/**
 * Created by WebStorm.
 * User: Mehedi Hasan
 * Date: 9/29/26
 * Time: 12:58 PM
 * Email: mdmehedihasanroni28@gmail.com
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/error.js";
import { requestBodyLogger, requestLogger } from "./middlewares/request-logger.js";
import { apiRoutes } from "./routes.js";

export const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(requestBodyLogger);

app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);
