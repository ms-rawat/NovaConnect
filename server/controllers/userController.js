const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // We don't want to return the current user in the list of all users
    const users = await User.find({ _id: { $ne: req.user._id } }).select('name email avatar');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Search for users
exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
      _id: { $ne: req.user._id } // Exclude self from search
    }).select('name email avatar');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Get user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends', 'name avatar');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends', 'name avatar');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.body.senderId);
    const receiver = await User.findById(req.params.id);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (receiver.friendRequests.includes(sender._id)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    receiver.friendRequests.push(sender._id);
    await receiver.save();

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const sender = await User.findById(req.body.senderId);

    if (!user || !sender) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends.push(sender._id);
    sender.friends.push(user._id);

    user.friendRequests = user.friendRequests.filter(
      (request) => request.toString() !== sender._id.toString()
    );

    await user.save();
    await sender.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Decline a friend request
exports.declineFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friendRequests = user.friendRequests.filter(
      (request) => request.toString() !== req.body.senderId.toString()
    );

    await user.save();

    res.status(200).json({ message: 'Friend request declined' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
