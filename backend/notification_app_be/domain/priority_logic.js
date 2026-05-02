const typePriority = {
  'Placement': 3,
  'Result': 2,
  'Event': 1,
};

class PriorityNotificationQueue {
  constructor(maxSize = 10) {
    this.maxSize = maxSize;
    this.queue = [];
  }

  compare(a, b) {
    const priorityA = typePriority[a.type] || 0;
    const priorityB = typePriority[b.type] || 0;

    if (priorityA !== priorityB) {
      return priorityB - priorityA; 
    }

    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    
    return timeB - timeA;
  }

  insert(notification) {
    let insertIndex = 0;
    while (insertIndex < this.queue.length && this.compare(this.queue[insertIndex], notification) <= 0) {
      insertIndex++;
    }

    this.queue.splice(insertIndex, 0, notification);

    if (this.queue.length > this.maxSize) {
      this.queue.pop(); 
    }
  }

  processStream(notifications) {
    notifications.forEach(n => this.insert(n));
  }

  getTopNotifications() {
    return this.queue;
  }
}

module.exports = { PriorityNotificationQueue };
