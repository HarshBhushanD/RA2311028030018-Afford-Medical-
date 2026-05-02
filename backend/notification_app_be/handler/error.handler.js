const { Log } = require('../../logging_middleware/index.js');

const errorHandler = async (err, req, res, next) => {
    try {
        await Log('backend', 'error', 'handler', err.message || 'Internal Server Error');
    } catch (logError) {
        console.error('Failed to log error:', logError.message);
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
