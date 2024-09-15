const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Add user route
router.post('/add', userController.addUser);

// Other routes
router.get('/view/:userId', userController.viewUser);
router.put('/update/:userId', userController.updateUser);
router.get('/logs', userController.getActivityLogs);  // Get activity logs route (to fetch logs)
module.exports = router;
