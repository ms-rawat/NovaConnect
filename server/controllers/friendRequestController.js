const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  const { recipientId } = req.body;
  const senderUid = req.user.uid;
   console.log('Sender:', senderUid);
    console.log('Recipient:', recipientId);

  try {
    // Find the sender and recipient User documents to get their MongoDB _ids
    const sender = await User.findOne({ googleId: senderUid });
    const recipient = await User.findOne({ _id: recipientId });
 
    if (!sender ) {
      return res.status(404).json({ message: 'Sender  not found.' });
    }
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' });
    } 

    const senderMongoId = sender._id;
    const recipientMongoId = recipient._id;

    // Prevent sending a request to oneself
    if (senderMongoId.equals(recipientMongoId)) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    // Check if they are already friends
    if (sender.friends.includes(recipientMongoId)) {
      return res.status(400).json({ message: 'You are already friends.' });
    }

    // Check if a request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderMongoId, recipient: recipientMongoId },
        { sender: recipientMongoId, recipient: senderMongoId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'A friend request is already pending.' });
    }

    const newRequest = new FriendRequest({
      sender: senderMongoId,
      recipient: recipientMongoId,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all friend requests for a user
exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const friendRequests = await FriendRequest.find({ recipient: user._id, status: 'pending' }).populate('sender', 'name profilePicture');
    console.log('Friend Requests:', friendRequests);
    console.log(req.user)
    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  console.log(req.user)

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    if (request.recipient == toString(req.user._id)) {
      return res.status(401).json({ message: 'You are not authorized to accept this request.' });
    }

    request.status = 'accepted';
    await request.save();

    // Add users to each other's friends list
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.recipient } });
    await User.findByIdAndUpdate(request.recipient, { $addToSet: { friends: request.sender } });

    res.status(200).json({ message: 'Friend request accepted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Reject a friend request
exports.rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    if (request.recipient.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You are not authorized to reject this request.' });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ message: 'Friend request rejected.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
