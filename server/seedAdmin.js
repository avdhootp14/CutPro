import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@cutpro.com" });
    
    if (adminExists) {
      console.log("Admin user already exists. You can log in with:");
      console.log("Email: admin@cutpro.com");
      console.log("Password: adminpassword123");
      process.exit(0);
    }

    // Create new admin
    const adminUser = await User.create({
      name: "Super Admin",
      email: "admin@cutpro.com",
      phone: "1234567890",
      password: "adminpassword123",
      role: "admin",
      isVerified: true
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@cutpro.com");
    console.log("Password: adminpassword123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
