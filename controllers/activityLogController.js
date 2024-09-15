const ActivityLog = require('../models/activityLogModel');

// Fetch activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ dateChanged: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
