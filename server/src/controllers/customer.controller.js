import Customer from "../models/Customer.js";
import Appointment from "../models/Appointment.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import sendEmail from "../utils/sendEmail.js";
import { getVerificationTemplate } from "../utils/emailTemplates.js";

/* -------------------------------------------------------------------------- */
/*                          Customer Dashboard                                */
/* -------------------------------------------------------------------------- */

export const getDashboard = asyncHandler(async (req, res) => {
  // Get logged-in customer
  const customer = await Customer.findById(req.user._id).select(
  `
  name
  email
  phone
  avatar
  isVerified
  createdAt
  updatedAt
  `
);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Statistics
  const totalAppointments = await Appointment.countDocuments({
    customer: req.user._id,
  });

  const completedAppointments = await Appointment.countDocuments({
    customer: req.user._id,
    status: "completed",
  });

  const pendingAppointments = await Appointment.countDocuments({
    customer: req.user._id,
    status: "pending",
  });

  const cancelledAppointments = await Appointment.countDocuments({
    customer: req.user._id,
    status: "cancelled",
  });

  // Next upcoming appointment
  const now = new Date();

  const upcomingAppointment = await Appointment.findOne({
    customer: req.user._id,
    appointmentDate: { $gte: now },
    status: "pending",
  })
    .populate(
      "barber",
      "name avatar experience specialization rating"
    )
    .populate("services", "name price duration")
    .sort({
      appointmentDate: 1,
      startTime: 1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profile: { ...customer.toObject(), role: "customer" },
        stats: {
          totalAppointments,
          completedAppointments,
          pendingAppointments,
          cancelledAppointments,
        },
        upcomingAppointment,
      },
      "Customer dashboard fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                           Get Customer Profile                             */
/* -------------------------------------------------------------------------- */

export const getProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.user._id).select(
    `
    name
    email
    phone
    avatar
    isVerified
    createdAt
    updatedAt
    `
  );

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { ...customer.toObject(), role: "customer" },
      "Customer profile fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                         Update Customer Profile                            */
/* -------------------------------------------------------------------------- */

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar, email } = req.body;

  const customer = await Customer.findById(req.user._id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Update only allowed fields
  if (name !== undefined) {
    customer.name = name;
  }

  if (phone !== undefined) {
    customer.phone = phone;
  }

  if (avatar !== undefined) {
    customer.avatar = avatar;
  }

  if (email !== undefined && email !== customer.email) {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      throw new ApiError(400, "Email is already in use by another account");
    }

    // Also check shop owners
    const Shop = (await import("../models/Shop.js")).default;
    const existingShop = await Shop.findOne({ "owner.email": email });
    if (existingShop) {
      throw new ApiError(400, "Email is already in use by another account");
    }

    customer.email = email;
    customer.isVerified = false;
    
    const verificationToken = customer.getVerificationToken();
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    const message = `You recently changed your email address. Please verify your new email by clicking the link below:\n\n${verificationUrl}`;

    try {
      await sendEmail({
        email: customer.email,
        subject: "Verify Your New Email - CutPro",
        message,
        htmlMessage: getVerificationTemplate(verificationUrl),
      });
    } catch (error) {
      customer.emailVerificationToken = undefined;
      customer.emailVerificationExpire = undefined;
      console.error("Email could not be sent:", error);
    }
  }

  await customer.save();

  const updatedCustomer = await Customer.findById(
    customer._id
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedCustomer,
      "Profile updated successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                    Get Upcoming Appointments                               */
/* -------------------------------------------------------------------------- */

export const getUpcomingAppointments = asyncHandler(
  async (req, res) => {
    const appointments = await Appointment.find({
  customer: req.user._id,
  status: "pending",
})
  .populate(
    "barber",
    "name avatar experience specialization rating"
  )
  .populate("services")
  .sort({
    appointmentDate: 1,
    startTime: 1,
  });

    return res.status(200).json(
      new ApiResponse(
        200,
        appointments,
        "Upcoming appointments fetched successfully"
      )
    );
  }
);
/* -------------------------------------------------------------------------- */
/*                      Get Past Appointments                                 */
/* -------------------------------------------------------------------------- */

export const getPastAppointments = asyncHandler(
  async (req, res) => {
    const appointments = await Appointment.find({
      customer: req.user._id,
      status: "completed",
    })
      .populate(
        "barber",
        "name avatar experience specialization rating"
      )
      .populate("services")
      .sort({
        appointmentDate: -1,
        startTime: -1,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        appointments,
        "Past appointments fetched successfully"
      )
    );
  }
);
/* -------------------------------------------------------------------------- */
/*                   Get Cancelled Appointments                               */
/* -------------------------------------------------------------------------- */

export const getCancelledAppointments = asyncHandler(
  async (req, res) => {
    const appointments = await Appointment.find({
      customer: req.user._id,
      status: "cancelled",
    })
      .populate(
        "barber",
        "name avatar experience specialization rating"
      )
      .populate("services")
      .sort({
        appointmentDate: -1,
        startTime: -1,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        appointments,
        "Cancelled appointments fetched successfully"
      )
    );
  }
);