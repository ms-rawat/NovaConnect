const User = require("../models/User");
const admin = require("../config/firebaseAdmin");

exports.googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verify Token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // 2. Check if user exists in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // 3. If not, CREATE new user (Register)
      user = new User({
        name: name,
        email: email,
        avatar: picture,
        googleId: uid, // Store Firebase UID
        friends: [],
        posts: []
      });
      await user.save();
    }

    // 4. Respond with User Data
    res.status(200).json(user);
    
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Invalid Token" });
  }
};