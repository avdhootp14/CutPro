import jwt from "jsonwebtoken";
import Shop from "../models/Shop.js";
import Customer from "../models/Customer.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

/* -------------------------------------------------------------------------- */
/*                   Generate Access & Refresh Tokens Helper                   */
/* -------------------------------------------------------------------------- */

const generateTokensForShop = async (shopId) => {
  const shop = await Shop.findById(shopId);
  const accessToken = shop.generateAccessToken();
  const refreshToken = shop.generateRefreshToken();
  shop.owner.refreshToken = refreshToken;
  await shop.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const generateTokensForCustomer = async (customerId) => {
  const customer = await Customer.findById(customerId);
  const accessToken = customer.generateAccessToken();
  const refreshToken = customer.generateRefreshToken();
  customer.refreshToken = refreshToken;
  await customer.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

/* -------------------------------------------------------------------------- */
/*                               Register User                                */
/* -------------------------------------------------------------------------- */

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingCustomer = await Customer.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingCustomer) {
    throw new ApiError(409, "User already exists");
  }

  // Also check if email/phone belongs to a shop owner
  const existingShop = await Shop.findOne({
    $or: [{ "owner.email": email }, { "owner.phone": phone }],
  });

  if (existingShop) {
    throw new ApiError(409, "User already exists");
  }

  const customer = await Customer.create({
    name,
    email,
    phone,
    password,
  });

  const verificationToken = customer.getVerificationToken();
  await customer.save({ validateBeforeSave: false });

  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  const message = `You are receiving this email because you (or someone else) registered for an account. Please verify your email by clicking the link below:\n\n${verificationUrl}`;

  try {
    await sendEmail({
      email: customer.email,
      subject: "Email Verification - CutPro",
      message,
    });
  } catch (error) {
    customer.emailVerificationToken = undefined;
    customer.emailVerificationExpire = undefined;
    await customer.save({ validateBeforeSave: false });
    console.error("Email could not be sent:", error);
  }

  const createdCustomer = await Customer.findById(customer._id).select(
    "-password -refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      createdCustomer,
      "User registered successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                            Register Partner (SaaS)                         */
/* -------------------------------------------------------------------------- */

export const registerPartner = asyncHandler(async (req, res) => {
  const { name, email, phone, password, shopName, country, state, district, city, address } = req.body;

  if (!name || !email || !phone || !password || !shopName || !country || !state || !district || !city || !address) {
    throw new ApiError(400, "All fields including location are required");
  }

  // Check if email/phone exists in customers
  const existingCustomer = await Customer.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingCustomer) {
    throw new ApiError(409, "A user with this email or phone already exists");
  }

  // Check if email/phone exists in shop owners
  const existingShop = await Shop.findOne({
    $or: [{ "owner.email": email }, { "owner.phone": phone }],
  });

  if (existingShop) {
    throw new ApiError(409, "A user with this email or phone already exists");
  }

  // Auto-generate shopSlug from shopName
  let baseSlug = shopName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  let shopSlug = baseSlug;
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const existingSlug = await Shop.findOne({ shopSlug });
    if (existingSlug) {
      shopSlug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      isUnique = true;
    }
  }

  const shop = await Shop.create({
    shopName,
    shopSlug,
    owner: {
      name,
      email,
      phone,
      password,
    },
    location: {
      country,
      state,
      district,
      city,
      address,
    },
  });

  // Return shop data without sensitive fields
  const createdShop = await Shop.findById(shop._id).select(
    "-owner.password -owner.refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      createdShop,
      "Partner account created successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                                Verify Email                                */
/* -------------------------------------------------------------------------- */

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Check in customers first
  let customer = await Customer.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (customer) {
    customer.isVerified = true;
    customer.emailVerificationToken = undefined;
    customer.emailVerificationExpire = undefined;
    await customer.save();

    return res.status(200).json(
      new ApiResponse(200, null, "Email verified successfully")
    );
  }

  // Check in shop owners
  let shop = await Shop.findOne({
    "owner.emailVerificationToken": emailVerificationToken,
    "owner.emailVerificationExpire": { $gt: Date.now() },
  });

  if (shop) {
    shop.owner.isVerified = true;
    shop.owner.emailVerificationToken = undefined;
    shop.owner.emailVerificationExpire = undefined;
    await shop.save();

    return res.status(200).json(
      new ApiResponse(200, null, "Email verified successfully")
    );
  }

  throw new ApiError(400, "Invalid or expired verification token");
});

/* -------------------------------------------------------------------------- */
/*                          Resend Verification Email                         */
/* -------------------------------------------------------------------------- */

export const resendVerification = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authorized");
  }

  // The user might be a customer or shop admin, check their role
  let isShopOwner = req.user.role === "admin";
  let userDoc;

  if (isShopOwner) {
    userDoc = await Shop.findById(req.user._id);
    if (!userDoc) throw new ApiError(404, "User not found");
    if (userDoc.owner.isVerified) {
      throw new ApiError(400, "Email is already verified");
    }
  } else {
    userDoc = await Customer.findById(req.user._id);
    if (!userDoc) throw new ApiError(404, "User not found");
    if (userDoc.isVerified) {
      throw new ApiError(400, "Email is already verified");
    }
  }

  // Generate new token
  const verificationToken = userDoc.getVerificationToken();
  await userDoc.save({ validateBeforeSave: false });

  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  const message = `Please verify your email by clicking the link below:\n\n${verificationUrl}`;

  try {
    await sendEmail({
      email: isShopOwner ? userDoc.owner.email : userDoc.email,
      subject: "Email Verification - CutPro",
      message,
    });
  } catch (error) {
    if (isShopOwner) {
      userDoc.owner.emailVerificationToken = undefined;
      userDoc.owner.emailVerificationExpire = undefined;
    } else {
      userDoc.emailVerificationToken = undefined;
      userDoc.emailVerificationExpire = undefined;
    }
    await userDoc.save({ validateBeforeSave: false });
    console.error("Email could not be sent:", error);
    throw new ApiError(500, "Email could not be sent");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Verification email sent successfully")
  );
});

/* -------------------------------------------------------------------------- */
/*                                 Login User                                 */
/* -------------------------------------------------------------------------- */

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  // Try shop owner first
  const shop = await Shop.findOne({ "owner.email": email });

  if (shop) {
    const isPasswordValid = await shop.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Credentials");
    }

    const { accessToken, refreshToken } = await generateTokensForShop(shop._id);

    const loggedInShop = await Shop.findById(shop._id).select(
      "-owner.password -owner.refreshToken"
    );

    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          {
            user: {
              _id: loggedInShop._id,
              name: loggedInShop.owner.name,
              email: loggedInShop.owner.email,
              phone: loggedInShop.owner.phone,
              avatar: loggedInShop.owner.avatar,
              isVerified: loggedInShop.owner.isVerified,
              role: "admin",
              shopName: loggedInShop.shopName,
              shopSlug: loggedInShop.shopSlug,
              shopLogo: loggedInShop.shopLogo,
              location: loggedInShop.location,
            },
            accessToken,
            refreshToken,
          },
          "Login successful"
        )
      );
  }

  // Try customer
  const customer = await Customer.findOne({ email });

  if (customer) {
    const isPasswordValid = await customer.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Credentials");
    }

    const { accessToken, refreshToken } = await generateTokensForCustomer(customer._id);

    const loggedInCustomer = await Customer.findById(customer._id).select(
      "-password -refreshToken"
    );

    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          {
            user: {
              ...loggedInCustomer.toObject(),
              role: "customer",
            },
            accessToken,
            refreshToken,
          },
          "Login successful"
        )
      );
  }

  throw new ApiError(404, "User does not exist");
});

/* -------------------------------------------------------------------------- */
/*                              Get Current User                              */
/* -------------------------------------------------------------------------- */

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                                 Logout User                                */
/* -------------------------------------------------------------------------- */

export const logoutUser = asyncHandler(async (req, res) => {
  if (req.user.role === "admin") {
    await Shop.findByIdAndUpdate(
      req.user._id,
      { $unset: { "owner.refreshToken": 1 } },
      { new: true }
    );
  } else if (req.user.role === "customer") {
    await Customer.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
  }

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {},
        "User logged out successfully"
      )
    );
});

/* -------------------------------------------------------------------------- */
/*                           Refresh Access Token                             */
/* -------------------------------------------------------------------------- */

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Verify Refresh Token
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  // Try shop owner first
  const shop = await Shop.findById(decodedToken.id);

  if (shop && incomingRefreshToken === shop.owner.refreshToken) {
    const { accessToken, refreshToken } = await generateTokensForShop(shop._id);

    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  }

  // Try customer
  const customer = await Customer.findById(decodedToken.id);

  if (customer && incomingRefreshToken === customer.refreshToken) {
    const { accessToken, refreshToken } = await generateTokensForCustomer(customer._id);

    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  }

  throw new ApiError(401, "Refresh Token is expired or invalid");
});

/* -------------------------------------------------------------------------- */
/*                              Forgot Password                               */
/* -------------------------------------------------------------------------- */

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide an email");
  }

  // Try to find a shop owner first
  let user = await Shop.findOne({ "owner.email": email });
  let isShopOwner = true;

  if (!user) {
    user = await Customer.findOne({ email });
    isShopOwner = false;
  }

  if (!user) {
    throw new ApiError(404, "There is no user with that email");
  }

  // Generate Reset Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please go to the following link to reset your password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: isShopOwner ? user.owner.email : user.email,
      subject: "Password Reset Request - CutPro",
      message,
    });

    res.status(200).json(new ApiResponse(200, null, "Email sent successfully"));
  } catch (err) {
    console.error("Email could not be sent:", err);
    if (isShopOwner) {
      user.owner.resetPasswordToken = undefined;
      user.owner.resetPasswordExpire = undefined;
    } else {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
    }

    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email could not be sent");
  }
});

/* -------------------------------------------------------------------------- */
/*                               Reset Password                               */
/* -------------------------------------------------------------------------- */

export const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // Try shop owner
  let user = await Shop.findOne({
    "owner.resetPasswordToken": resetPasswordToken,
    "owner.resetPasswordExpire": { $gt: Date.now() },
  });
  let isShopOwner = true;

  if (!user) {
    user = await Customer.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    isShopOwner = false;
  }

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  if (!req.body.password) {
    throw new ApiError(400, "Please provide a new password");
  }

  // Set new password
  if (isShopOwner) {
    user.owner.password = req.body.password;
    user.owner.resetPasswordToken = undefined;
    user.owner.resetPasswordExpire = undefined;
  } else {
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  }

  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});