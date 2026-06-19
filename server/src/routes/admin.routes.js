import { Router } from "express";
import {
  getDashboardStats,
  getAllAppointments,
  addBarber,
  updateBarber,
  getAllBarbers,
  addService,
  updateService,
  deleteService,
  updateProfile,
  requestPasswordReset,
  resetPassword
} from "../controllers/admin.controller.js";
import verifyJWT, { isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Public route (needs token but no JWT)
router.route("/reset-password/:token").put(resetPassword);

// All routes below require authentication and admin role
router.use(verifyJWT, isAdmin);

// Dashboard
router.route("/stats").get(getDashboardStats);

// Appointments
router.route("/appointments").get(getAllAppointments);

// Barbers
router.route("/barbers").get(getAllBarbers).post(addBarber);
router.route("/barbers/:id").put(updateBarber);

// Services
router.route("/services").post(addService);
router.route("/services/:id").put(updateService).delete(deleteService);

// Profile
router.route("/profile").put(updateProfile);
router.route("/request-password-reset").post(requestPasswordReset);

export default router;
