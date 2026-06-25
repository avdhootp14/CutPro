import Shop from "../models/Shop.js";
import Barber from "../models/Barber.js";
import Service from "../models/Service.js";
import Appointment from "../models/Appointment.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalAppointments = await Appointment.countDocuments({ shopId: req.user._id });
  const totalBarbers = await Barber.countDocuments({ shopId: req.user._id, isActive: true });
  
  const customersList = await Appointment.distinct("customer", { shopId: req.user._id });
  const totalCustomers = customersList.length;

  const totalServices = await Service.countDocuments({ shopId: req.user._id });

  const recentAppointments = await Appointment.find({ shopId: req.user._id })
    .sort({ appointmentDate: -1 })
    .limit(5)
    .populate("barber", "name avatar")
    .populate("customer", "name phone")
    .populate("services", "name price");

  // Revenue Calculations
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const appointmentsForRevenue = await Appointment.find({ shopId: req.user._id, status: { $ne: 'cancelled' } });
  
  let dailyRevenue = 0;
  let weeklyRevenue = 0;
  let monthlyRevenue = 0;
  let totalRevenue = 0;

  appointmentsForRevenue.forEach(app => {
    const appDate = new Date(app.appointmentDate);
    const price = app.totalPrice || 0;
    
    totalRevenue += price;
    
    if (appDate >= startOfMonth) monthlyRevenue += price;
    if (appDate >= startOfWeek) weeklyRevenue += price;
    if (appDate >= startOfDay) dailyRevenue += price;
  });

  res.status(200).json(
    new ApiResponse(200, {
      totalAppointments,
      totalBarbers,
      totalCustomers,
      totalServices,
      recentAppointments,
      revenue: {
        daily: dailyRevenue,
        weekly: weeklyRevenue,
        monthly: monthlyRevenue,
        total: totalRevenue
      }
    }, "Dashboard stats fetched successfully")
  );
});

// @desc    Get all appointments
// @route   GET /api/v1/admin/appointments
// @access  Private/Admin
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ shopId: req.user._id })
    .sort({ appointmentDate: -1, startTime: -1 })
    .populate("barber", "name avatar")
    .populate("customer", "name phone")
    .populate("services", "name price duration");

  return res.status(200).json(
    new ApiResponse(200, appointments, "Appointments fetched successfully")
  );
});

/* -------------------------------------------------------------------------- */
/*                        Update Appointment Status                           */
/* -------------------------------------------------------------------------- */

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status provided");
  }

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  appointment.status = status;
  await appointment.save();

  return res.status(200).json(
    new ApiResponse(200, appointment, "Appointment status updated successfully")
  );
});

// @desc    Add a new barber
// @route   POST /api/v1/admin/barbers
// @access  Private/Admin
export const addBarber = asyncHandler(async (req, res) => {
  const { name, phone, experience, specialization, workingHours, bio, portfolioImages, avatar } = req.body;

  if (!name) {
    throw new ApiError(400, "Barber name is required");
  }

  const barber = await Barber.create({
    shopId: req.user._id,
    name,
    phone,
    experience,
    specialization,
    workingHours,
    bio,
    portfolioImages,
    avatar,
  });

  res.status(201).json(
    new ApiResponse(201, barber, "Barber created successfully")
  );
});

// @desc    Update a barber
// @route   PUT /api/v1/admin/barbers/:id
// @access  Private/Admin
export const updateBarber = asyncHandler(async (req, res) => {
  const { name, phone, experience, specialization, workingHours, isActive, bio, portfolioImages } = req.body;
  const barberId = req.params.id;

  const barber = await Barber.findOne({ _id: barberId, shopId: req.user._id });
  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  barber.name = name || barber.name;
  barber.phone = phone || barber.phone;
  barber.experience = experience !== undefined ? experience : barber.experience;
  barber.specialization = specialization || barber.specialization;
  barber.workingHours = workingHours || barber.workingHours;
  
  if (bio !== undefined) barber.bio = bio;
  if (portfolioImages !== undefined) barber.portfolioImages = portfolioImages;
  
  if (isActive !== undefined) {
      barber.isActive = isActive;
  }

  await barber.save();

  res.status(200).json(
    new ApiResponse(200, barber, "Barber updated successfully")
  );
});

// @desc    Get all barbers
// @route   GET /api/v1/admin/barbers
// @access  Private/Admin
export const getAllBarbers = asyncHandler(async (req, res) => {
    const barbers = await Barber.find({ shopId: req.user._id });
    res.status(200).json(new ApiResponse(200, barbers, "Barbers fetched successfully"));
});

// @desc    Add a new service
// @route   POST /api/v1/admin/services
// @access  Private/Admin
export const addService = asyncHandler(async (req, res) => {
  const { name, description, price, duration, category, hasOffer, discountPrice } = req.body;

  const serviceExists = await Service.findOne({ name, shopId: req.user._id });
  if (serviceExists) {
    throw new ApiError(400, "Service with this name already exists");
  }

  const service = await Service.create({
    name,
    description,
    price,
    duration,
    category,
    hasOffer,
    discountPrice,
    shopId: req.user._id
  });

  res.status(201).json(
    new ApiResponse(201, service, "Service created successfully")
  );
});

// @desc    Update a service
// @route   PUT /api/v1/admin/services/:id
// @access  Private/Admin
export const updateService = asyncHandler(async (req, res) => {
  const { name, description, price, duration, category, hasOffer, discountPrice, isActive } = req.body;
  
  const service = await Service.findOne({ _id: req.params.id, shopId: req.user._id });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  service.name = name || service.name;
  service.description = description || service.description;
  service.price = price !== undefined ? price : service.price;
  service.duration = duration || service.duration;
  service.category = category || service.category;
  
  if (hasOffer !== undefined) service.hasOffer = hasOffer;
  if (discountPrice !== undefined) service.discountPrice = discountPrice;
  if (isActive !== undefined) service.isActive = isActive;

  await service.save();

  res.status(200).json(
    new ApiResponse(200, service, "Service updated successfully")
  );
});

// @desc    Delete a service
// @route   DELETE /api/v1/admin/services/:id
// @access  Private/Admin
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, shopId: req.user._id });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  service.isActive = false;
  await service.save();

  res.status(200).json(
    new ApiResponse(200, {}, "Service deleted successfully")
  );
});

// @desc    Update admin profile
// @route   PUT /api/v1/admin/profile
// @access  Private/Admin
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, shopName, shopLogo, country, state, district, city, address } = req.body;

  const shop = await Shop.findById(req.user._id);
  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  // Check if email/phone already taken by another user
  if (email && email !== shop.owner.email) {
    const emailExistsInShops = await Shop.findOne({ "owner.email": email, _id: { $ne: shop._id } });
    const emailExistsInCustomers = await import("../models/Customer.js").then(m => m.default.findOne({ email }));
    if (emailExistsInShops || emailExistsInCustomers) throw new ApiError(400, "Email already in use");
  }
  if (phone && phone !== shop.owner.phone) {
    const phoneExistsInShops = await Shop.findOne({ "owner.phone": phone, _id: { $ne: shop._id } });
    const phoneExistsInCustomers = await import("../models/Customer.js").then(m => m.default.findOne({ phone }));
    if (phoneExistsInShops || phoneExistsInCustomers) throw new ApiError(400, "Phone number already in use");
  }

  shop.owner.name = name || shop.owner.name;
  shop.owner.email = email || shop.owner.email;
  shop.owner.phone = phone || shop.owner.phone;
  if (shopName !== undefined) shop.shopName = shopName;
  if (shopLogo !== undefined) shop.shopLogo = shopLogo;
  if (country !== undefined) shop.location.country = country;
  if (state !== undefined) shop.location.state = state;
  if (district !== undefined) shop.location.district = district;
  if (city !== undefined) shop.location.city = city;
  if (address !== undefined) shop.location.address = address;

  await shop.save();

  const updatedShop = await Shop.findById(shop._id).select("-owner.password -owner.refreshToken");

  res.status(200).json(
    new ApiResponse(200, updatedShop, "Profile updated successfully")
  );
});

import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";

// @desc    Request password reset link
// @route   POST /api/v1/admin/request-password-reset
// @access  Private/Admin
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.user._id);
  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  // Get reset token
  const resetToken = shop.getResetPasswordToken();

  await shop.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: shop.owner.email,
      subject: 'Password reset token',
      message,
      htmlMessage: getResetPasswordTemplate(resetUrl),
    });

    res.status(200).json(
      new ApiResponse(200, {}, "Email sent")
    );
  } catch (err) {
    console.error(err);
    shop.owner.resetPasswordToken = undefined;
    shop.owner.resetPasswordExpire = undefined;

    await shop.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email could not be sent");
  }
});

// @desc    Reset password
// @route   PUT /api/v1/admin/reset-password/:token
// @access  Public (But requires token)
export const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const shop = await Shop.findOne({
    "owner.resetPasswordToken": resetPasswordToken,
    "owner.resetPasswordExpire": { $gt: Date.now() },
  });

  if (!shop) {
    throw new ApiError(400, "Invalid token");
  }

  // Set new password
  shop.owner.password = req.body.password;
  shop.owner.resetPasswordToken = undefined;
  shop.owner.resetPasswordExpire = undefined;
  await shop.save();

  res.status(200).json(
    new ApiResponse(200, {}, "Password reset success")
  );
});

// @desc    Get stats for a specific barber (replaces barber dashboard)
// @route   GET /api/v1/admin/barbers/:barberId/stats
// @access  Private/Admin
export const getBarberStats = asyncHandler(async (req, res) => {
  const { barberId } = req.params;

  const barber = await Barber.findOne({ _id: barberId, shopId: req.user._id });
  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  // Today's range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayAppointments = await Appointment.countDocuments({
    barber: barberId,
    appointmentDate: { $gte: todayStart, $lte: todayEnd },
    status: { $ne: "cancelled" },
  });

  const pendingAppointments = await Appointment.countDocuments({
    barber: barberId,
    status: "pending",
  });

  const completedAppointments = await Appointment.countDocuments({
    barber: barberId,
    status: "completed",
  });

  const totalAppointments = await Appointment.countDocuments({
    barber: barberId,
  });

  const cancelledAppointments = await Appointment.countDocuments({
    barber: barberId,
    status: "cancelled",
  });

  const revenueResult = await Appointment.aggregate([
    {
      $match: {
        barber: barber._id,
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  const todayRevenueResult = await Appointment.aggregate([
    {
      $match: {
        barber: barber._id,
        paymentStatus: "paid",
        appointmentDate: { $gte: todayStart, $lte: todayEnd },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      barber,
      stats: {
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        totalAppointments,
        cancelledAppointments,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        todayRevenue: todayRevenueResult[0]?.revenue || 0,
      },
    }, "Barber stats fetched successfully")
  );
});
