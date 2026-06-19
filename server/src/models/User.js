import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["customer", "admin", "barber"],
      default: "customer",
    },

    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    experience: {
  type: Number,
  default: 0,
},

specialization: [
  {
    type: String,
    trim: true,
  },
],

services: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
],

workingDays: [
  {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
],

startTime: {
  type: String,
  default: "09:00",
},

endTime: {
  type: String,
  default: "19:00",
},

rating: {
  type: Number,
  default: 0,
},

totalReviews: {
  type: Number,
  default: 0,
},

isAvailable: {
  type: Boolean,
  default: true,
},

isActive: {
  type: Boolean,
  default: true,
},
    refreshToken: {
      type: String,
      default: "",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    // Shop Admin Fields
    shopSlug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // Allows multiple null/undefined values for non-admins
    },
    shopName: {
      type: String,
      trim: true,
    },
    shopLogo: {
      type: String,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },

    // Barber Specific Fields
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    portfolioImages: {
      type: [String],
      default: [],
    },
    
    shopOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Only required for barbers, but we can't make it strict required since customers and admins don't have it
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/*                         Hash Password Before Saving                         */
/* -------------------------------------------------------------------------- */

userSchema.pre("save", async function () {
  // Don't hash again if password wasn't modified
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

/* -------------------------------------------------------------------------- */
/*                         Compare Password During Login                       */
/* -------------------------------------------------------------------------- */

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* -------------------------------------------------------------------------- */
/*                          Generate JWT Access Token                          */
/* -------------------------------------------------------------------------- */

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    }
  );
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 mins)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;