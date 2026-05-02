const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification.controller');
const { Log } = require('../../logging_middleware/index.js');

router.use(async (req, res, next) => {
    try {
        await Log('backend', 'info', 'route', `Incoming request: ${req.method} ${req.url}`);
    } catch (e) {
        console.error('Failed to log route:', e.message);
    }
    next();
});

router.get('/all', notificationController.getAllNotifications);
router.get('/priority', notificationController.getPriorityNotifications);

module.exports = router;
