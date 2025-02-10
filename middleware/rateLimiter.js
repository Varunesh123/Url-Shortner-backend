import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 10 requests per minute
  message: "Too many requests, please try again later."
});

export default limiter;
