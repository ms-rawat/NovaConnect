const admin = require("../config/firebaseAdmin");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication failed: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
       req.user = decodedToken;
        const user = await User.findOne({ googleId: decodedToken.uid });
        if (!user) return res.status(404).json({ message: "User not found" });
        req.user = await User.findOne({ googleId: decodedToken.uid });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed: Invalid token" });
  }
};

module.exports = authMiddleware;
