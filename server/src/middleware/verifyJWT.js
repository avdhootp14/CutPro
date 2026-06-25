import jwt from "jsonwebtoken";
import Shop from "../models/Shop.js";
import Customer from "../models/Customer.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const { id, role } = decodedToken;
    let user;

    if (role === "admin") {
      const shop = await Shop.findById(id);
      if (!shop) {
        throw new ApiError(401, "Invalid access token");
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
        throw new ApiError(401, "Invalid access token");
      }
      user = {
        ...customer.toObject(),
        role: "customer",
      };
    } else {
      // Barbers don't log in — reject unknown roles
      throw new ApiError(401, "Invalid access token");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid access token"
    );
  }
});

export default verifyJWT;