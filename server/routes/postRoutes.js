const express = require("express");
const multer = require("multer");
const path = require("path");
const { createPost, getPosts, deletePost } = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Multer Config (Temp storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/", authMiddleware, upload.single("file"), createPost); // Create
router.get("/", authMiddleware, getPosts);                           // Read
router.delete("/:id", authMiddleware, deletePost);                   // Delete

module.exports = router;