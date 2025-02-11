import express from "express";
import { shortenUrl, redirectUrl, listURLs } from "../controllers/urlController.js";
import { authenticateUser } from "../middleware/jwtAuth.js";

const router = express.Router();

// Redirect short URL to the original URL
router.get('/list', authenticateUser, listURLs)
router.get("/:alias", redirectUrl);

// Shorten a URL
router.post("/", authenticateUser, shortenUrl);

export default router;
