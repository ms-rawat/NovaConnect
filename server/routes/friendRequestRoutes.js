const express = require('express');
const router = express.Router();
const {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} = require('../controllers/friendRequestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Send a friend request
router.post('/', authMiddleware, sendFriendRequest);

// Get all friend requests for a user
router.get('/', authMiddleware, getFriendRequests);

// Accept a friend request
router.put('/:requestId/accept', authMiddleware, acceptFriendRequest);

// Reject a friend request
router.put('/:requestId/reject', authMiddleware, rejectFriendRequest);

module.exports = router;
