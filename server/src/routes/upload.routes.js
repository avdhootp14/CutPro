import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

// Protect all upload routes
router.use(verifyJWT);

router.post("/image", upload.single("image"), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
  if (!cloudinaryResponse) {
    throw new ApiError(500, "Failed to upload image to Cloudinary");
  }

  return res.status(200).json(
    new ApiResponse(200, { url: cloudinaryResponse.secure_url }, "Image uploaded successfully")
  );
}));

router.post("/images", upload.array("images", 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Image files are required");
  }

  const urls = [];
  for (const file of req.files) {
    const cloudinaryResponse = await uploadOnCloudinary(file.path);
    if (cloudinaryResponse) {
      urls.push(cloudinaryResponse.secure_url);
    }
  }

  return res.status(200).json(
    new ApiResponse(200, { urls }, "Images uploaded successfully")
  );
}));

export default router;
