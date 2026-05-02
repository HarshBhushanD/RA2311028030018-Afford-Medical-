const { Log } = require('../../logging_middleware/index.js');
const apiService = require('./api.service.js');
const { PriorityNotificationQueue } = require('../domain/priority_logic.js');

const getAllNotifications = async () => {
    try {
        const notifications = await apiService.fetchNotifications();
        await Log('backend', 'info', 'service', 'Successfully processed getAllNotifications');
        return notifications;
    } catch (error) {
        await Log('backend', 'error', 'service', `Error: ${error.message}`);
        throw error;
    }
};

const getPriorityNotifications = async (filterType = 'All') => {
    try {
        const notifications = await apiService.fetchNotifications();
        const queue = new PriorityNotificationQueue(10);
        queue.processStream(notifications);
        
        let topNotifications = queue.getTopNotifications();
        if (filterType !== 'All') {
            topNotifications = topNotifications.filter(n => n.type === filterType);
        }

        await Log('backend', 'info', 'service', `Processed getPriorityNotifications`);
        return topNotifications;
    } catch (error) {
        await Log('backend', 'error', 'service', `Error: ${error.message}`);
        throw error;
    }
};

module.exports = { getAllNotifications, getPriorityNotifications };
