import Url from "../models/Url.js";
import redis from "../config/redis.js";

export const getUrlAnalytics = async (req, res) => {
  const { alias } = req.params;

  try {
    const url = await Url.findOne({ shortUrl: alias });
    if (!url) return res.status(404).json({ message: "URL not found" });

    // Fetch analytics from Redis
    const totalClicks = await redis.get(`clicks:${alias}`) || 0;
    const uniqueUsers = await redis.scard(`users:${alias}`) || 0;

    res.json({ alias, totalClicks, uniqueUsers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
