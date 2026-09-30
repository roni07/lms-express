import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

// Express 5 passes listen errors (e.g. EADDRINUSE) to this callback instead of throwing
const server = app.listen(env.PORT, (error) => {
  if (error) {
    logger.fatal({ err: error }, `Failed to start server on port ${env.PORT}`);
    process.exitCode = 1;
    return;
  }
  logger.info(`Server listening on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
