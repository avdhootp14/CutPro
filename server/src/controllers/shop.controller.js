import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.js";

// @desc    Get shop identity details (name, logo) by slug
// @route   GET /api/v1/shop/:shopSlug
// @access  Public
export const getShopIdentity = asyncHandler(async (req, res) => {
  const { shopSlug } = req.params;

  const admin = await User.findOne({ shopSlug, role: 'admin' }).select("shopName shopLogo");
  
  if (!admin) {
    throw new ApiError(404, "Shop not found");
  }

  res.status(200).json(
    new ApiResponse(200, {
      shopName: admin.shopName || "CUTPRO",
      shopLogo: admin.shopLogo || ""
    }, "Shop identity fetched successfully")
  );
});

// @desc    Get all shops for marketplace directory
// @route   GET /api/v1/shop/directory
// @access  Public
export const getShopDirectory = asyncHandler(async (req, res) => {
  const { country, state, district, city } = req.query;

  let query = { role: 'admin' };
  
  // Apply filters if provided
  if (country) query.country = new RegExp(country, 'i');
  if (state) query.state = new RegExp(state, 'i');
  if (district) query.district = new RegExp(district, 'i');
  if (city) query.city = new RegExp(city, 'i');

  const shops = await User.find(query).select(
    "shopName shopSlug shopLogo country state district city address"
  );

  res.status(200).json(
    new ApiResponse(200, shops, "Shop directory fetched successfully")
  );
});
