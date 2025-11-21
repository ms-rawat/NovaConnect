const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');

exports.findOrCreateChat = async (req, res) => {
  const senderId = req.user._id; 
  const { recipientId } = req.body;

  if (!recipientId) {
    return res.status(400).json({ message: 'Recipient ID is required.' });
  }

  const mongoose = require('mongoose');
  const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

  const members = [senderId, recipientObjectId].sort();

  try {
    let chat = await Chat.findOne({
      members: { $all: [senderId, recipientObjectId] },
    });

    if (!chat) {
      chat = new Chat({
        members: members,
      });
      await chat.save();
    }

    const recipient = await User.findById(recipientObjectId).select('name avatar');

    res.status(200).json({ chatId: chat._id, recipient });
  } catch (error) {
    if (error.code === 11000) {
      // Race condition occurred, chat was created by the other user in parallel.
      // Find the existing chat and return it.
      let chat = await Chat.findOne({
        members: { $all: [senderId, recipientObjectId] },
      });
      const recipient = await User.findById(recipientObjectId).select('name avatar');
      return res.status(200).json({ chatId: chat._id, recipient });
    }
    console.error('Error in findOrCreateChat:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.userChats = async (req, res) => {
  const userId = req.user._id;
  console.log('Fetching chats for user:', userId.toString());
  try {
    const chat = await Chat.find({
      members: { $in: [userId] }, 
    }).populate({
      path: 'members',
      select: 'name avatar email' // Select fields you want to expose
    }).sort({ updatedAt: -1 }); // Show most recent chats first
    console.log('Chats found:', chat);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await Message.find({ chatId });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.sendMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const message = new Message({
        chatId,
        senderId,
        text,
    });
    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
