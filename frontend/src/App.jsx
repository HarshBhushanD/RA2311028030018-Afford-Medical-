import { useState, useEffect, useCallback } from 'react';
import { fetchAllNotifications, fetchPriorityNotifications } from './services/api';
import { logger } from './utils/logger';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination for all notifications
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  // Filter for priority notifications
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Read status from local storage
  const [readStatuses, setReadStatuses] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (activeTab === 'all') {
        data = await fetchAllNotifications();
      } else {
        data = await fetchPriorityNotifications(priorityFilter);
      }
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications from backend');
      logger.error('Error fetching from backend', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, priorityFilter]);

  useEffect(() => {
    const storedStatuses = JSON.parse(localStorage.getItem('notificationStatuses')) || {};
    setReadStatuses(storedStatuses);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const markAsRead = (id) => {
    const updatedStatuses = { ...readStatuses, [id]: true };
    setReadStatuses(updatedStatuses);
    localStorage.setItem('notificationStatuses', JSON.stringify(updatedStatuses));
    logger.debug(`Marked notification ${id} as read`);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const NotificationCard = ({ item, index }) => {
    const isRead = readStatuses[item.id] || false;
    
    return (
      <div 
        className={`notification-card animate-fade-in ${!isRead ? 'unread' : ''}`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => !isRead && markAsRead(item.id)}
      >
        <div className="card-header">
          <span className={`type-badge type-${item.type.toLowerCase()}`}>
            {item.type}
          </span>
          <span className="timestamp">{formatDate(item.timestamp)}</span>
        </div>
        <div className="card-message">{item.message}</div>
        <div className="card-footer">
          <span className="status-text">{isRead ? 'Viewed' : 'New'}</span>
        </div>
      </div>
    );
  };

  // Logic for All Notifications Tab
  const renderAllNotifications = () => {
    const totalPages = Math.ceil(notifications.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const currentList = notifications.slice(startIndex, startIndex + limit);

    return (
      <>
        <div className="notifications-grid">
          {currentList.map((item, index) => (
            <NotificationCard key={item.id} item={item} index={index} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button 
              className="btn" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  // Logic for Priority Notifications Tab
  const renderPriorityNotifications = () => {
    return (
      <>
        <div className="filters-container animate-fade-in">
          <span className="filter-label">Filter by Type:</span>
          <select 
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              logger.info(`Priority filter changed to: ${e.target.value}`);
            }}
          >
            <option value="All">All Types</option>
            <option value="Placement">Placement</option>
            <option value="Result">Result</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {notifications.length === 0 ? (
          <div className="loading">No notifications match this filter.</div>
        ) : (
          <div className="notifications-grid">
            {notifications.map((item, index) => (
              <NotificationCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <h1 className="header-title">Campus Hub</h1>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
              logger.info('Switched to All Notifications tab');
            }}
          >
            All Notifications
          </button>
          <button 
            className={`nav-tab ${activeTab === 'priority' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('priority');
              setPriorityFilter('All');
              logger.info('Switched to Priority Inbox tab');
            }}
          >
            Priority Inbox
          </button>
        </div>
      </header>

      <main>
        {loading && <div className="loading animate-fade-in">Loading from Backend Server...</div>}
        {error && <div className="error-msg animate-fade-in">{error}</div>}
        
        {!loading && !error && (
          <div className="tab-content">
            {activeTab === 'all' ? renderAllNotifications() : renderPriorityNotifications()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
