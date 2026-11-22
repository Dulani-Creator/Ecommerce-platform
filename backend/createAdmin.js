import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

async function makeAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is missing in .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const adminEmail = "admin@amethyste.com";
    const adminPassword = "admin123";
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      existingUser.Role = "admin";
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log(`Updated existing user to Admin! Email: ${adminEmail} | Password: ${adminPassword}`);
    } else {
      await User.create({
        firstName: "Directrice",
        lastName: "Sophia",
        email: adminEmail,
        password: hashedPassword,
        Role: "admin",
        isEmailVerified: true,
      });
      console.log(`Created new Admin account! Email: ${adminEmail} | Password: ${adminPassword}`);
    }

    console.log("You can now log in at http://localhost:5173/login with this account.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin:", err);
    process.exit(1);
  }
}

makeAdmin();
