import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// Must import User after dotenv config if User relies on env, but let's connect first
import User from '../models/User.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const createShopOwner = async () => {
  try {
    await connectDB();

    const args = process.argv.slice(2);
    
    if (args.length < 5) {
      console.log(`
❌ Missing Arguments!

Usage:
node src/scripts/createShop.js <ShopName> <ShopSlug> <Email> <Password> <Phone>

Example:
node src/scripts/createShop.js "Aurora Salon" "aurora" "admin@aurora.com" "password123" "9876543210"
      `);
      process.exit(1);
    }

    const [shopName, shopSlug, email, password, phone] = args;

    // Check if slug or email exists
    const existingSlug = await User.findOne({ shopSlug });
    if (existingSlug) {
      console.log(`❌ Error: The slug '${shopSlug}' is already taken.`);
      process.exit(1);
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log(`❌ Error: The email '${email}' is already registered.`);
      process.exit(1);
    }

    // Create the Admin User
    const admin = await User.create({
      name: 'Shop Owner', // Default name
      email,
      phone,
      password,
      role: 'admin',
      shopName,
      shopSlug: shopSlug.toLowerCase()
    });

    console.log(`
🎉 SUCCESS! New Shop Created.

-----------------------------------
🏢 Shop Name : ${admin.shopName}
🔗 Shop URL  : cutpro.com/${admin.shopSlug}
📧 Login Email: ${admin.email}
🔑 Password  : ${password}
-----------------------------------

The salon owner can now log in at /admin/login and start adding their barbers and services!
    `);

    process.exit(0);

  } catch (error) {
    console.error(`❌ Unexpected Error:`, error);
    process.exit(1);
  }
};

createShopOwner();
