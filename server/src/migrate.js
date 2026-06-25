import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

import Shop from "./models/Shop.js";
import Customer from "./models/Customer.js";
import Barber from "./models/Barber.js";

const migrate = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB!");

    const db = mongoose.connection.db;

    // 1. Get all legacy users
    const legacyUsers = await db.collection("users").find({}).toArray();
    console.log(`Found ${legacyUsers.length} legacy users.`);

    for (const user of legacyUsers) {
      if (user.role === "admin" || user.role === "owner") {
        // Create Shop
        const existingShop = await Shop.findById(user._id);
        if (!existingShop) {
          const shop = new Shop({
            _id: user._id,
            shopName: user.shopName || `${user.name || "Admin"}'s Shop`,
            shopSlug: user.shopSlug || (user.name ? user.name.toLowerCase().replace(/\s+/g, '-') : `shop-${user._id}`),
            shopLogo: user.avatar || "",
            owner: {
              name: user.name || "Admin",
              email: user.email,
              phone: user.phone || `0000000000-${user._id}`,
              password: user.password, // Already hashed
              avatar: user.avatar || "",
              isVerified: user.isVerified || false,
              refreshToken: user.refreshToken || "",
            },
            location: {
              country: user.country || "",
              state: user.state || "",
              district: user.district || "",
              city: user.city || "",
              address: user.address || "",
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
          // Insert directly to bypass pre-save hook for password hashing
          await db.collection("shops").insertOne(shop.toObject());
          console.log(`Migrated Admin -> Shop: ${user.name || user.email}`);
        }
      } else if (user.role === "customer") {
        const existingCustomer = await Customer.findById(user._id);
        if (!existingCustomer) {
          const customer = new Customer({
            _id: user._id,
            name: user.name || "Customer",
            email: user.email,
            phone: user.phone || `0000000000-${user._id}`,
            password: user.password, // Already hashed
            avatar: user.avatar || "",
            isVerified: user.isVerified || false,
            refreshToken: user.refreshToken || "",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
          // Insert directly to bypass pre-save hook
          await db.collection("customers").insertOne(customer.toObject());
          console.log(`Migrated Customer: ${user.name || user.email}`);
        }
      } else if (user.role === "barber") {
        const existingBarber = await Barber.findById(user._id);
        if (!existingBarber) {
          // Find the shop this barber belongs to (assuming shopOwner was used)
          const shopId = user.shopOwner || user.adminId;
          
          if (!shopId) {
            console.warn(`WARNING: Barber ${user.name} has no shopOwner! Skipping.`);
            continue;
          }

          const barber = new Barber({
            _id: user._id,
            shopId: shopId,
            name: user.name || "Barber",
            phone: user.phone || "",
            avatar: user.avatar || "",
            experience: user.experience || 0,
            specialization: user.specialization || [],
            services: user.services || [],
            workingHours: user.workingHours || [],
            rating: user.rating || 0,
            totalReviews: user.totalReviews || 0,
            isAvailable: user.isAvailable !== undefined ? user.isAvailable : true,
            isActive: user.isActive !== undefined ? user.isActive : true,
            bio: user.bio || "",
            portfolioImages: user.portfolioImages || [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
          await db.collection("barbers").insertOne(barber.toObject());
          console.log(`Migrated Barber: ${user.name || user.email}`);
        }
      }
    }

    console.log("User migration complete. Updating references in other collections...");

    // 2. Service: rename shopOwner -> shopId
    const services = await db.collection("services").find({ shopOwner: { $exists: true } }).toArray();
    for (const service of services) {
      await db.collection("services").updateOne(
        { _id: service._id },
        { 
          $set: { shopId: service.shopOwner },
          $unset: { shopOwner: "" } 
        }
      );
    }
    console.log(`Updated ${services.length} services (shopOwner -> shopId).`);

    // 3. Appointment: rename shopOwner -> shopId
    const appointments = await db.collection("appointments").find({ shopOwner: { $exists: true } }).toArray();
    for (const app of appointments) {
      await db.collection("appointments").updateOne(
        { _id: app._id },
        { 
          $set: { shopId: app.shopOwner },
          $unset: { shopOwner: "" } 
        }
      );
    }
    console.log(`Updated ${appointments.length} appointments (shopOwner -> shopId).`);

    console.log("Migration complete! You can safely delete the 'users' collection now.");
    process.exit(0);

  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrate();
