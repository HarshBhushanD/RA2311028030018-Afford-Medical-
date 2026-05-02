const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./notification_app_be/route/notification.routes');
const errorHandler = require('./notification_app_be/handler/error.handler');
const { Log } = require('./logging_middleware/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await Log('backend', 'info', 'route', `Server started on port ${PORT}`);
    } catch (e) {
        console.error('Failed to log startup:', e.message);
    }
});
