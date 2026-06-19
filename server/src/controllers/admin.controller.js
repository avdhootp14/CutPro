import User from "../models/User.js";
import Service from "../models/Service.js";
import Appointment from "../models/Appointment.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalAppointments = await Appointment.countDocuments({ shopOwner: req.user._id });
  const totalBarbers = await User.countDocuments({ role: "barber", shopOwner: req.user._id });
  
  const customersList = await Appointment.distinct("customer", { shopOwner: req.user._id });
  const totalCustomers = customersList.length;

  const totalServices = await Service.countDocuments({ shopOwner: req.user._id });

  const recentAppointments = await Appointment.find({ shopOwner: req.user._id })
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

  // We only count 'completed' or 'paid' appointments as revenue usually, or 'confirmed'. 
  // Let's count all that are not cancelled for this simple example, or just sum totalPrice.
  const appointmentsForRevenue = await Appointment.find({ shopOwner: req.user._id, status: { $ne: 'cancelled' } });
  
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
  const appointments = await Appointment.find({ shopOwner: req.user._id })
    .sort({ appointmentDate: -1, startTime: -1 })
    .populate("barber", "name avatar")
    .populate("customer", "name phone email")
    .populate("services", "name price");

  res.status(200).json(
    new ApiResponse(200, appointments, "Appointments fetched successfully")
  );
});

// @desc    Add a new barber
// @route   POST /api/v1/admin/barbers
// @access  Private/Admin
export const addBarber = asyncHandler(async (req, res) => {
  const { name, email, phone, password, experience, specialization, workingDays, startTime, endTime } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    throw new ApiError(400, "User with this email or phone already exists");
  }

  const barber = await User.create({
    name,
    email,
    phone,
    password,
    role: "barber",
    experience,
    specialization,
    workingDays,
    startTime,
    endTime,
    shopOwner: req.user._id,
    isVerified: true
  });

  const createdBarber = await User.findById(barber._id).select("-password -refreshToken");

  res.status(201).json(
    new ApiResponse(201, createdBarber, "Barber created successfully")
  );
});

// @desc    Update a barber
// @route   PUT /api/v1/admin/barbers/:id
// @access  Private/Admin
export const updateBarber = asyncHandler(async (req, res) => {
  const { name, phone, experience, specialization, workingDays, startTime, endTime, isActive, bio, portfolioImages } = req.body;
  const barberId = req.params.id;

  const barber = await User.findOne({ _id: barberId, shopOwner: req.user._id });
  if (!barber || barber.role !== "barber") {
    throw new ApiError(404, "Barber not found");
  }

  barber.name = name || barber.name;
  barber.phone = phone || barber.phone;
  barber.experience = experience !== undefined ? experience : barber.experience;
  barber.specialization = specialization || barber.specialization;
  barber.workingDays = workingDays || barber.workingDays;
  barber.startTime = startTime || barber.startTime;
  barber.endTime = endTime || barber.endTime;
  
  if (bio !== undefined) barber.bio = bio;
  if (portfolioImages !== undefined) barber.portfolioImages = portfolioImages;
  
  if (isActive !== undefined) {
      barber.isActive = isActive;
  }

  await barber.save();

  const updatedBarber = await User.findById(barberId).select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, updatedBarber, "Barber updated successfully")
  );
});

// @desc    Get all barbers
// @route   GET /api/v1/admin/barbers
// @access  Private/Admin
export const getAllBarbers = asyncHandler(async (req, res) => {
    const barbers = await User.find({ role: "barber", shopOwner: req.user._id }).select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, barbers, "Barbers fetched successfully"));
});

// @desc    Add a new service
// @route   POST /api/v1/admin/services
// @access  Private/Admin
export const addService = asyncHandler(async (req, res) => {
  const { name, description, price, duration, category, hasOffer, discountPrice } = req.body;

  const serviceExists = await Service.findOne({ name, shopOwner: req.user._id });
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
    shopOwner: req.user._id
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
  
  const service = await Service.findOne({ _id: req.params.id, shopOwner: req.user._id });
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
  const service = await Service.findOne({ _id: req.params.id, shopOwner: req.user._id });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  // Soft delete or hard delete? Let's hard delete for simplicity unless isActive is used.
  // The model has isActive, so soft delete is better.
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

  const admin = await User.findById(req.user._id);
  if (!admin) {
    throw new ApiError(404, "User not found");
  }

  // Check if email/phone already taken by another user
  if (email && email !== admin.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: admin._id } });
    if (emailExists) throw new ApiError(400, "Email already in use");
  }
  if (phone && phone !== admin.phone) {
    const phoneExists = await User.findOne({ phone, _id: { $ne: admin._id } });
    if (phoneExists) throw new ApiError(400, "Phone number already in use");
  }

  admin.name = name || admin.name;
  admin.email = email || admin.email;
  admin.phone = phone || admin.phone;
  if (shopName !== undefined) admin.shopName = shopName;
  if (shopLogo !== undefined) admin.shopLogo = shopLogo;
  if (country !== undefined) admin.country = country;
  if (state !== undefined) admin.state = state;
  if (district !== undefined) admin.district = district;
  if (city !== undefined) admin.city = city;
  if (address !== undefined) admin.address = address;

  await admin.save();

  const updatedAdmin = await User.findById(admin._id).select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, updatedAdmin, "Profile updated successfully")
  );
});

import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// @desc    Request password reset link
// @route   POST /api/v1/admin/request-password-reset
// @access  Private/Admin
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user._id);
  if (!admin) {
    throw new ApiError(404, "User not found");
  }

  // Get reset token
  const resetToken = admin.getResetPasswordToken();

  await admin.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: admin.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json(
      new ApiResponse(200, {}, "Email sent")
    );
  } catch (err) {
    console.error(err);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save({ validateBeforeSave: false });

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

  const admin = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!admin) {
    throw new ApiError(400, "Invalid token");
  }

  // Set new password
  admin.password = req.body.password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;
  await admin.save();

  res.status(200).json(
    new ApiResponse(200, {}, "Password reset success")
  );
});
