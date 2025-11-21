const express = require('express');
const {
  getUser,
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  searchUsers,
  getAllUsers,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, searchUsers);
router.get('/all', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUser);
router.get('/:id/friends', authMiddleware, getFriends);
router.post('/:id/friend-request', authMiddleware, sendFriendRequest);
router.post('/:id/accept-request', authMiddleware, acceptFriendRequest);
router.post('/:id/decline-request', authMiddleware, declineFriendRequest);

module.exports = router;
