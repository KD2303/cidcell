// backend/socket/onlineStore.js
// Shared online users store (Map: userId -> Set of socketIds)
// Extracted so that REST API routes can check online status.
const onlineUsers = new Map();

module.exports = { onlineUsers };
