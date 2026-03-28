import http from 'http';
import { createApp } from "./app";
import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { logger } from "./shared/utils/logger";
import { initializeSocket } from './shared/services/socket.service';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);

  // Initialize WebSocket
  initializeSocket(httpServer);

  const server = httpServer.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        env: env.NODE_ENV,
        api: `http://localhost:${env.PORT}${env.API_PREFIX}/health`,
      },
      "🚀 Server started",
    );
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, "Shutdown signal received...");
    server.close(async () => {
      await disconnectDatabase();
      logger.info("Shutdown complete");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled Promise Rejection");
    shutdown("unhandledRejection");
  });

  process.on("uncaughtException", (error) => {
    logger.fatal({ error }, "Uncaught Exception");
    process.exit(1);
  });
};

bootstrap().catch((err) => {
  logger.fatal({ err }, "Bootstrap failed");
  process.exit(1);
});
