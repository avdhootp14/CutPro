import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Shop from "../models/Shop.js";

// @desc    Get shop identity details (name, logo) by slug
// @route   GET /api/v1/shop/:shopSlug
// @access  Public
export const getShopIdentity = asyncHandler(async (req, res) => {
  const { shopSlug } = req.params;

  const shop = await Shop.findOne({ shopSlug }).select("shopName shopLogo");
  
  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  res.status(200).json(
    new ApiResponse(200, {
      shopName: shop.shopName || "CUTPRO",
      shopLogo: shop.shopLogo || ""
    }, "Shop identity fetched successfully")
  );
});

// @desc    Get all shops for marketplace directory
// @route   GET /api/v1/shop/directory
// @access  Public
export const getShopDirectory = asyncHandler(async (req, res) => {
  const { country, state, district, city } = req.query;

  let query = {};
  
  // Apply filters if provided
  if (country) query["location.country"] = new RegExp(country, 'i');
  if (state) query["location.state"] = new RegExp(state, 'i');
  if (district) query["location.district"] = new RegExp(district, 'i');
  if (city) query["location.city"] = new RegExp(city, 'i');

  const shops = await Shop.find(query).select(
    "shopName shopSlug shopLogo location"
  );

  res.status(200).json(
    new ApiResponse(200, shops, "Shop directory fetched successfully")
  );
});
