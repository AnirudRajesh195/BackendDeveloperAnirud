const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect the route
router.use(authMiddleware);

// Route to get activity logs
router.get('/logs', activityLogController.getActivityLogs);

module.exports = router;
