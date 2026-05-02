# Notification System Design

## 1. Architecture
The Campus Notifications System consists of a decoupled frontend (React) and a custom Express backend.

## 2. Backend Priority Logic
- Uses a Domain-Driven approach.
- Logic is encapsulated in `domain/priority_logic.js`.
- Priority is determined by:
  1. **Type**: Placement (3) > Result (2) > Event (1).
  2. **Timestamp**: Newer notifications are prioritized.

## 3. Logging Middleware
- Located at the root of the backend folder.
- Validates stack, level, and package parameters.
- Forwards to the external evaluation-service.
