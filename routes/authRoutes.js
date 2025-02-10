import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const router = express.Router();

// Google login route (Ensure scope is included ✅)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // ✅ Request access to profile & email
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user, info) => {
      if (err) {
        console.error("Google OAuth Error:", err);
        return res.status(500).json({ error: "Authentication failed" });
      }
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      let myuser = await User.findOne({
        googleId: user.user.googleId
      })
      if (!myuser){
        myuser = await User.create({
          googleId: user.user.googleId,
          name: user.user.name,
          email: user.user.email
        })
      }
      req.user = myuser
      next();
    })(req, res, next);
  },
  (req, res) => {
    // console.log("jwt secret", process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);  
  }
);
export default router;
