import Barber from "../models/Barber.js";
import Shop from "../models/Shop.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------------------------------------------------------------- */
/*                             Create Barber                                  */
/* -------------------------------------------------------------------------- */

export const createBarber = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    experience,
    specialization,
    services,
    workingHours,
    bio,
    portfolioImages,
    avatar,
    shopId,
  } = req.body;

  if (!name || !shopId) {
    throw new ApiError(400, "Barber name and shopId are required");
  }

  // Verify the shop exists
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  const barber = await Barber.create({
    shopId,
    name,
    phone,
    experience,
    specialization,
    services,
    workingHours,
    bio,
    portfolioImages,
    avatar,
  });

  const createdBarber = await Barber.findById(barber._id)
    .populate("services");

  return res.status(201).json(
    new ApiResponse(
      201,
      createdBarber,
      "Barber created successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Get All Barbers                                  */
/* -------------------------------------------------------------------------- */

export const getAllBarbers = asyncHandler(async (req, res) => {
  const { shopSlug } = req.query;

  let query = {
    isActive: true,
    deletedAt: null,
  };

  if (shopSlug) {
    const shop = await Shop.findOne({ shopSlug });
    if (!shop) {
      return res.status(200).json(new ApiResponse(200, [], "No shop found for this slug"));
    }
    query.shopId = shop._id;
  }

  const barbers = await Barber.find(query)
    .populate("services")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      barbers,
      "Barbers fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Get Barber By ID                                 */
/* -------------------------------------------------------------------------- */

export const getBarberById = asyncHandler(async (req, res) => {
  const barber = await Barber.findById(req.params.id)
    .populate("services");

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      barber,
      "Barber fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                             Update Barber                                  */
/* -------------------------------------------------------------------------- */

export const updateBarber = asyncHandler(async (req, res) => {
  const barber = await Barber.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("services");

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      barber,
      "Barber updated successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                          Toggle Availability                               */
/* -------------------------------------------------------------------------- */

export const toggleAvailability = asyncHandler(async (req, res) => {
  const barber = await Barber.findById(req.params.id);

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  barber.isAvailable = !barber.isAvailable;

  await barber.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      barber,
      `Barber is now ${
        barber.isAvailable ? "Available" : "Unavailable"
      }`
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Soft Delete Barber                               */
/* -------------------------------------------------------------------------- */

export const deleteBarber = asyncHandler(async (req, res) => {
  const barber = await Barber.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
      deletedAt: new Date(),
    },
    {
      new: true,
    }
  );

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Barber deactivated successfully"
    )
  );
});