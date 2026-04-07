import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { UserModel } from "./modules/users/user.schema";
import { logger } from "./shared/utils/logger";

// Load environment variables
dotenv.config();

const ADMIN_PHONE = "+998901234567";
const ADMIN_PASSWORD = "AdminPass123";
const ADMIN_NAME = "Administrator";

async function seedAdminUser() {
  try {
    logger.info("Starting database seed...");

    // Connect to database
    await connectDatabase();

    // Check if admin already exists
    const adminExists = await UserModel.findOne({ role: "ADMIN" });
    if (adminExists) {
      logger.warn("Admin user already exists. Skipping seed.");
      await disconnectDatabase();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin user
    const admin = await UserModel.create({
      phoneNumber: ADMIN_PHONE,
      password: hashedPassword,
      name: ADMIN_NAME,
      role: "ADMIN",
    });

    logger.info(
      {
        userId: String(admin._id),
        phoneNumber: admin.phoneNumber,
        name: admin.name,
      },
      "✅ Admin user created successfully"
    );

    console.log("\n========== ADMIN USER CREATED ==========");
    console.log(`Phone: ${admin.phoneNumber}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Name: ${admin.name}`);
    console.log("========================================\n");

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error({ error: message }, "❌ Seed failed");
    console.error("\nError:", message);
    process.exit(1);
  }
}

seedAdminUser();
