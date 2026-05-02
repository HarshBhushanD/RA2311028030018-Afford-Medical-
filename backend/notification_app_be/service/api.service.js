const { Log, ACCESS_TOKEN } = require('../../logging_middleware/index.js');

const API_URL = 'http://20.207.122.201/evaluation-service/notifications';

const fetchNotifications = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(API_URL, { 
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      signal: controller.signal 
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const json = await response.json();
    
    // The API returns PascalCase keys inside a "notifications" array.
    // We map them to lowercase to match our app's expected structure.
    const data = (json.notifications || []).map(n => ({
      id: n.ID,
      type: n.Type,
      message: n.Message,
      timestamp: n.Timestamp
    }));

    await Log('backend', 'info', 'service', 'Successfully fetched notifications from external API');
    return data;
  } catch (error) {
    await Log('backend', 'error', 'service', `Failed to fetch from API: ${error.message}`);
    throw error;
  }
};

module.exports = { fetchNotifications };
