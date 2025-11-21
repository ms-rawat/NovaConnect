const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: String,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: String,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
