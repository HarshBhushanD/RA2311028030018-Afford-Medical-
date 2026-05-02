const notificationService = require('../service/notification.service');
const { Log } = require('../../logging_middleware/index.js');

const getAllNotifications = async (req, res, next) => {
    try {
        await Log('backend', 'info', 'controller', 'Received request to get all notifications');
        const notifications = await notificationService.getAllNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

const getPriorityNotifications = async (req, res, next) => {
    try {
        const filterType = req.query.type || 'All';
        await Log('backend', 'info', 'controller', `Received request to get priority notifications`);
        const notifications = await notificationService.getPriorityNotifications(filterType);
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllNotifications, getPriorityNotifications };
