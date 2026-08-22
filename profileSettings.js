const db = require("../database/database");

db.prepare(`
  CREATE TABLE IF NOT EXISTS profile_settings (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    primary_colour TEXT DEFAULT '#7C3AED',
    secondary_colour TEXT DEFAULT '#15152B',
    text_colour TEXT DEFAULT '#FFFFFF',
    background TEXT DEFAULT 'default',
    PRIMARY KEY (guild_id, user_id)
  )
`).run();

function getProfileSettings(guildId, userId) {
  let settings = db.prepare(`
    SELECT * FROM profile_settings
    WHERE guild_id = ? AND user_id = ?
  `).get(guildId, userId);

  if (!settings) {
    db.prepare(`
      INSERT INTO profile_settings (guild_id, user_id)
      VALUES (?, ?)
    `).run(guildId, userId);

    settings = getProfileSettings(guildId, userId);
  }

  return settings;
}
function updateProfileBackground(guildId, userId, background) {
  getProfileSettings(guildId, userId);

  db.prepare(`
    UPDATE profile_settings
    SET background = ?
    WHERE guild_id = ? AND user_id = ?
  `).run(background, guildId, userId);
}
function updateProfileColours(guildId, userId, primary, secondary, text) {
  getProfileSettings(guildId, userId);

  db.prepare(`
    UPDATE profile_settings
    SET primary_colour = ?, secondary_colour = ?, text_colour = ?
    WHERE guild_id = ? AND user_id = ?
  `).run(primary, secondary, text, guildId, userId);
}

module.exports = {
  getProfileSettings,
  updateProfileColours,
  updateProfileBackground
};
