import express from "express";
import { getUrlAnalytics } from "../controllers/analyticsController.js";
import { authenticateUser } from "../middleware/jwtAuth.js";

const router = express.Router();

// Get analytics for a specific short URL
router.get("/:alias", authenticateUser, getUrlAnalytics);

export default router;
