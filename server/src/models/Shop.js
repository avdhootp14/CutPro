import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const shopSchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------------------- */
    /*                            Shop Identity                               */
    /* ---------------------------------------------------------------------- */
    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
    },
    shopSlug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shopLogo: {
      type: String,
      default: "",
    },

    /* ---------------------------------------------------------------------- */
    /*                        Owner (Embedded Subdocument)                     */
    /* ---------------------------------------------------------------------- */
    owner: {
      name: {
        type: String,
        required: [true, "Owner name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Owner email is required"],
        unique: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Owner phone is required"],
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      avatar: {
        type: String,
        default: "",
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      refreshToken: {
        type: String,
        default: "",
      },
      emailVerificationToken: String,
      emailVerificationExpire: Date,
      resetPasswordToken: String,
      resetPasswordExpire: Date,
    },

    /* ---------------------------------------------------------------------- */
    /*                              Location                                  */
    /* ---------------------------------------------------------------------- */
    location: {
      country: { type: String, trim: true },
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      city: { type: String, trim: true },
      address: { type: String, trim: true },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/*                         Hash Password Before Saving                        */
/* -------------------------------------------------------------------------- */

shopSchema.pre("save", async function () {
  if (!this.isModified("owner.password")) return;
  this.owner.password = await bcrypt.hash(this.owner.password, 10);
});

/* -------------------------------------------------------------------------- */
/*                       Compare Password During Login                        */
/* -------------------------------------------------------------------------- */

shopSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.owner.password);
};

/* -------------------------------------------------------------------------- */
/*                             Generate Tokens                                */
/* -------------------------------------------------------------------------- */

shopSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.owner.email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

shopSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

shopSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.owner.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.owner.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

shopSchema.methods.getVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.owner.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.owner.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
  return verificationToken;
};



const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
