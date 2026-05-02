import { logger } from '../utils/logger';

const API_BASE_URL = 'http://localhost:5000/api/notifications';

export const fetchAllNotifications = async () => {
  try {
    logger.info('Fetching ALL notifications from backend...');
    const response = await fetch(`${API_BASE_URL}/all`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    logger.info('Successfully fetched all notifications from backend');
    return data;
  } catch (error) {
    logger.error('Failed to fetch from backend', error.message);
    return [];
  }
};

export const fetchPriorityNotifications = async (filterType = 'All') => {
  try {
    logger.info(`Fetching PRIORITY notifications from backend (filter: ${filterType})...`);
    const response = await fetch(`${API_BASE_URL}/priority?type=${filterType}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    logger.info('Successfully fetched priority notifications from backend');
    return data;
  } catch (error) {
    logger.error('Failed to fetch priority notifications from backend', error.message);
    return [];
  }
};
