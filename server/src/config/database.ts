import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../shared/utils/logger";

export const connectDatabase = async (): Promise<void> => {
  mongoose.connection.on("connected", () =>
    logger.info("✅ MongoDB connected"),
  );
  mongoose.connection.on("error", (err) =>
    logger.error({ err }, "MongoDB connection error"),
  );
  mongoose.connection.on("disconnected", () =>
    logger.warn("MongoDB disconnected"),
  );

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected gracefully");
};
