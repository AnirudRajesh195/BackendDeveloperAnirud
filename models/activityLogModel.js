const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },  // Username of the person who made the change
  field: { type: String, required: true },  // The field that was updated
  oldValue: { type: String, required: true },  // The old value
  newValue: { type: String, required: true },  // The new value
  dateChanged: { type: Date, default: Date.now },  // Timestamp of the change
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;
