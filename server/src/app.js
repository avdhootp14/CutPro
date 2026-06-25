import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import barberRoutes from "./routes/barber.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import customerRoutes from "./routes/customer.routes.js";

import queueRoutes from "./routes/queue.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

/* ===========================
   Middlewares
=========================== */

// 1. Security Headers
app.use(helmet());

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes"
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window` for auth routes
  message: "Too many authentication attempts from this IP, please try again after 15 minutes"
});

// Apply global rate limiter to all requests
app.use(limiter);

// 3. Body Parsing
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// 4. CORS
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',') 
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000", "http://192.168.1.3:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// 5. Cookie Parsing
app.use(cookieParser());

/* ===========================
   Routes
=========================== */

app.get("/", (req, res) => {
  res.send("CutPro Backend Running 🚀");
});

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/barbers", barberRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/customer", customerRoutes);

app.use("/api/v1/queue", queueRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/upload", uploadRoutes);
/* ===========================
   Global Error Handler
   (ALWAYS LAST)
=========================== */

app.use(errorHandler);

export default app;