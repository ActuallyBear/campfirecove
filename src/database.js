const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const directory = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, "../data");
fs.mkdirSync(directory, { recursive: true });
const db = new Database(path.join(directory, "campfire-cove.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS levels (guild_id TEXT, user_id TEXT, xp INTEGER DEFAULT 0, messages INTEGER DEFAULT 0, PRIMARY KEY(guild_id,user_id));
  CREATE TABLE IF NOT EXISTS warnings (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, user_id TEXT, moderator_id TEXT, reason TEXT, created_at INTEGER);
  CREATE TABLE IF NOT EXISTS suggestions (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, user_id TEXT, text TEXT, message_id TEXT, upvotes INTEGER DEFAULT 0, downvotes INTEGER DEFAULT 0, status TEXT DEFAULT 'Pending');
  CREATE TABLE IF NOT EXISTS votes (suggestion_id INTEGER, user_id TEXT, vote TEXT, PRIMARY KEY(suggestion_id,user_id));
  CREATE TABLE IF NOT EXISTS counting (guild_id TEXT PRIMARY KEY, channel_id TEXT, current INTEGER DEFAULT 0, last_user_id TEXT);
`);
module.exports = db;
