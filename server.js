import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import passport from "passport";
import connectDB from "./config/db.js";
import limiter from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import swaggerDocs from "./docs/swagger.js";
import "./middleware/passportAuth.js";
import morgan from "morgan";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(passport.initialize());
app.use(morgan('dev'))
app.use(limiter);

// Database connection
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/api/urls", urlRoutes);
app.use("/api/analytics", analyticsRoutes);

// Swagger Documentation
swaggerDocs(app);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,"localhost", () => console.log(`🚀 Server running on port ${PORT}`));
