const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const pitchRoutes = require("./routes/pitchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const ideaValidationRoutes = require("./routes/ideaValidationRoutes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

// ✅ CORS must come FIRST
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3001",
    "https://startup-launch-omega.vercel.app"
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};
app.use(cors(corsOptions));

// ✅ Must also handle OPTIONS manually for some cases
app.options("*", cors(corsOptions));

// Then security, rate limit, etc.
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Body parsers and cookies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "StartupLaunch API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Database health check
app.get("/health/db", async (req, res) => {
  try {
    const prisma = require('./config/db');
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "Database connection is healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/pitches", pitchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/validate-idea", ideaValidationRoutes);

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "StartupLaunch API",
    version: "1.0.0",
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
