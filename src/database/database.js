const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dataDir =
  process.env.RAILWAY_VOLUME_MOUNT_PATH ||
  path.join(__dirname, "../../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, "campfire-cove.db"));

module.exports = db;
