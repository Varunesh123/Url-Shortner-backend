import jwt from "jsonwebtoken";

export const googleAuth = async (req, res) => {
  try {
    const { id, email, name } = req.user;
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("tkn:", token)
    res.json({ token, user: { id, email, name } });
  } catch (error) {
    res.status(500).json({ message: "Authentication failed" });
  }
};
