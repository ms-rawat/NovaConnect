const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    trim: true,
  },
  // URL from Cloudinary
  mediaUrl: {
    type: String,
  },
  // CRITICAL: To distinguish between image and video on frontend
  mediaType: {
    type: String,
    enum: ['image', 'video', 'none'],
    default: 'none',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);