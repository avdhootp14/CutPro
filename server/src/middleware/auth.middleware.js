import jwt from "jsonwebtoken";
import Shop from "../models/Shop.js";
import Customer from "../models/Customer.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Verify JWT
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const { id, role } = decodedToken;
  let user;

  if (role === "admin") {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new ApiError(401, "Invalid Access Token");
    }
    // Flatten owner data for req.user convenience
    user = {
      _id: shop._id,
      name: shop.owner.name,
      email: shop.owner.email,
      phone: shop.owner.phone,
      avatar: shop.owner.avatar,
      isVerified: shop.owner.isVerified,
      role: "admin",
      shopName: shop.shopName,
      shopSlug: shop.shopSlug,
      shopLogo: shop.shopLogo,
      location: shop.location,
    };
  } else if (role === "customer") {
    const customer = await Customer.findById(id).select(
      "-password -refreshToken"
    );
    if (!customer) {
      throw new ApiError(401, "Invalid Access Token");
    }
    user = {
      ...customer.toObject(),
      role: "customer",
    };
  } else {
    throw new ApiError(401, "Invalid Access Token");
  }

  // Attach user to request
  req.user = user;

  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    throw new ApiError(403, "Not authorized as an admin");
  }
});

export default verifyJWT;