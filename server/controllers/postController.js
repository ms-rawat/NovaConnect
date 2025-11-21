const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

// Create a new Post
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const user = await User.findOne({ googleId: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let mediaUrl = "";
    let mediaType = "none";

    // If there is a file, upload to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto", // Auto-detect image or video
        folder: "novaconnect_posts",
      });

      mediaUrl = uploadResult.secure_url;
      mediaType = uploadResult.resource_type;

      fs.unlinkSync(req.file.path);
    }

    const newPost = new Post({
      user: user._id,
      text,
      mediaUrl,
      mediaType,
    });

    const savedPost = await newPost.save();

    // Populate user details immediately for the frontend
    await savedPost.populate("user", "name avatar");

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Posts (Feed)
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name avatar") // Get owner info
      .sort({ createdAt: -1 }); // Newest first
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await User.findOne({ googleId: req.user.uid });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Verify ownership
    if (post.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
};