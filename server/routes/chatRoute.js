const express = require('express');
const { findOrCreateChat, userChats, findChat, getMessages, sendMessage } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, findOrCreateChat);
router.get('/', authMiddleware, userChats);
router.get('/find/:firstId/:secondId', authMiddleware, findChat);
router.get('/messages/:chatId', authMiddleware, getMessages);
router.post('/messages', authMiddleware, sendMessage);

module.exports = router;
