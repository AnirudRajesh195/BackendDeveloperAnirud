const bcrypt = require('bcryptjs');
const User = require('../models/userModels');
const ActivityLog = require('../models/activityLogModel');

// Add Admin/User
exports.addUser = async (req, res) => {
  // Same addUser function as provided before
};

// View User/Admin details by userId
exports.viewUser = async (req, res) => {
  const { userId } = req.params;
  const userMakingRequest = req.user;
  try {
    // Find user by ID
    const user = await User.findById(userId).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Admin/User (updateUser function already present)
// Track updates and log them in activity logs
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { password, ...rest } = req.body;  // Exclude password from update
  const userMakingChanges = req.user;  // Assume req.user contains the authenticated user making the request

  try {
    // Find the user being updated
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent password updates
    if (password) {
      return res.status(400).json({ message: 'Password cannot be updated' });
    }

    // Track changes
    const changes = [];
    for (let key in rest) {
      if (user[key] !== rest[key]) {
        changes.push({
          field: key,
          oldValue: user[key],
          newValue: rest[key],
          username: userMakingChanges.email,
          userId: userId,
        });
      }
    }

    // Update user fields
    Object.assign(user, rest);
    user.updatedAt = Date.now();

    // Save the updated user
    await user.save();

    // Save changes in activity logs
    if (changes.length > 0) {
      await ActivityLog.insertMany(changes);
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Fetch activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ dateChanged: -1 });  // Sort by most recent changes
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};