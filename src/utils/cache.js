// utils/cache.js
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300 }); // Default TTL of 5 minutes

module.exports = {
  get: (key) => {
    return cache.get(key);
  },
  set: (key, value, ttl) => {
    cache.set(key, value, ttl);
  },
  del: (key) => {
    cache.del(key);
  },
  flush: () => {
    cache.flushAll();
  },
};
