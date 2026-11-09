const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data.json');

// Initial schema template
const defaultData = {
  protection: {
    enabled: true,
    modules: {
      anti_ban: true,
      anti_kick: true,
      anti_channel: true,
      anti_role: true,
      anti_bot: true,
      anti_spam: true
    },
    limits: {
      ban: { limit: 3, punishment: 'ban' },
      kick: { limit: 3, punishment: 'kick' },
      channel_delete: { limit: 2, punishment: 'remove_roles' },
      role_delete: { limit: 2, punishment: 'remove_roles' }
    },
    whitelist: {
      users: [],
      roles: []
    }
  },
  warnings: {}, // { [guildId]: { [userId]: [{ id, reason, moderator, timestamp }] } }
  backups: {},  // { [backupId]: { id, guildName, createdAt, channels: [], roles: [] } }
  autoresponses: {}, // { [guildId]: [{ id, trigger, response, matchType }] }
  settings: {
    reviewChannels: {} // { [guildId]: channelId }
  }
};

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DB Read Error]:', err.message);
    return defaultData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[DB Write Error]:', err.message);
  }
}

const db = {
  get: (pathKey, defaultValue = null) => {
    const data = readDB();
    const parts = pathKey.split('.');
    let cur = data;
    for (const p of parts) {
      if (cur === undefined || cur === null) return defaultValue;
      cur = cur[p];
    }
    return cur !== undefined ? cur : defaultValue;
  },

  set: (pathKey, value) => {
    const data = readDB();
    const parts = pathKey.split('.');
    let cur = data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    writeDB(data);
    return value;
  },

  push: (pathKey, item) => {
    const data = readDB();
    const parts = pathKey.split('.');
    let cur = data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    const lastKey = parts[parts.length - 1];
    if (!Array.isArray(cur[lastKey])) {
      cur[lastKey] = [];
    }
    cur[lastKey].push(item);
    writeDB(data);
    return cur[lastKey];
  }
};

module.exports = db;
