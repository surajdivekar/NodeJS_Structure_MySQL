const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const sequelize = require("./config/database");
const routes = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");
const db = require("./models");
const app = express();

// Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Static file serving
app.use("/uploads", express.static("uploads"));
app.use("/course", express.static("course"));
app.use("/uploads/profile", express.static("profile"));
app.use("/uploads/sessions", express.static("sessions"));

// Request body sanitization
app.use((req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim();
    }
  }
  next();
});

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "URL Not Found" });
});

const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully!");

    // Sync all models
    await db.sequelize.sync({ alter: true, force: true });
    console.log("All models were synchronized successfully.");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    throw err;
  }
};
module.exports = { app, initializeDatabase };
