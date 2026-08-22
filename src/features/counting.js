const db = require("../database/database");

// Stores the current counting state for each server
db.prepare(`
  CREATE TABLE IF NOT EXISTS counting_settings (
    guild_id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    current_number INTEGER DEFAULT 0,
    last_user_id TEXT
  )
`).run();

// Stores each member's successful counts
db.prepare(`
  CREATE TABLE IF NOT EXISTS counting_users (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    successful_counts INTEGER DEFAULT 0,
    highest_count INTEGER DEFAULT 0,
    PRIMARY KEY (guild_id, user_id)
  )
`).run();

function getCountingSettings(guildId) {
  return db.prepare(`
    SELECT *
    FROM counting_settings
    WHERE guild_id = ?
  `).get(guildId);
}

function setupCountingChannel(guildId, channelId) {
  db.prepare(`
    INSERT INTO counting_settings (
      guild_id,
      channel_id,
      current_number,
      last_user_id
    )
    VALUES (?, ?, 0, NULL)
    ON CONFLICT(guild_id)
    DO UPDATE SET
      channel_id = excluded.channel_id,
      current_number = 0,
      last_user_id = NULL
  `).run(guildId, channelId);
}

function resetCounting(guildId) {
  const result = db.prepare(`
    UPDATE counting_settings
    SET current_number = 0,
        last_user_id = NULL
    WHERE guild_id = ?
  `).run(guildId);

  return result.changes > 0;
}

function getUserCountingStats(guildId, userId) {
  return db.prepare(`
    SELECT *
    FROM counting_users
    WHERE guild_id = ?
      AND user_id = ?
  `).get(guildId, userId);
}

function getCountingLeaderboard(guildId, limit = 10) {
  return db.prepare(`
    SELECT *
    FROM counting_users
    WHERE guild_id = ?
    ORDER BY successful_counts DESC
    LIMIT ?
  `).all(guildId, limit);
}

function recordSuccessfulCount(guildId, userId, number) {
  db.prepare(`
    INSERT INTO counting_users (
      guild_id,
      user_id,
      successful_counts,
      highest_count
    )
    VALUES (?, ?, 1, ?)
    ON CONFLICT(guild_id, user_id)
    DO UPDATE SET
      successful_counts = successful_counts + 1,
      highest_count = MAX(highest_count, excluded.highest_count)
  `).run(guildId, userId, number);
}

async function handleCountingMessage(message) {
  if (!message.guild || message.author.bot) return false;

  const settings = getCountingSettings(message.guild.id);

  if (!settings) return false;
  if (message.channel.id !== settings.channel_id) return false;

  const content = message.content.trim();

  // Only allow messages containing a whole number
  if (!/^\d+$/.test(content)) {
    await message.delete().catch(() => null);

    const warning = await message.channel.send({
      content: `${message.author}, only send the next number in this channel.`
    }).catch(() => null);

    if (warning) {
      setTimeout(() => {
        warning.delete().catch(() => null);
      }, 5000);
    }

    return true;
  }

  const submittedNumber = Number(content);
  const expectedNumber = settings.current_number + 1;

  if (submittedNumber !== expectedNumber) {
    await message.delete().catch(() => null);

    const warning = await message.channel.send({
      content: `${message.author}, the next number is **${expectedNumber}**.`
    }).catch(() => null);

    if (warning) {
      setTimeout(() => {
        warning.delete().catch(() => null);
      }, 5000);
    }

    return true;
  }

  if (settings.last_user_id === message.author.id) {
    await message.delete().catch(() => null);

    const warning = await message.channel.send({
      content: `${message.author}, you cannot count twice in a row.`
    }).catch(() => null);

    if (warning) {
      setTimeout(() => {
        warning.delete().catch(() => null);
      }, 5000);
    }

    return true;
  }

  const updateCount = db.prepare(`
    UPDATE counting_settings
    SET current_number = ?,
        last_user_id = ?
    WHERE guild_id = ?
      AND current_number = ?
  `);

  const result = updateCount.run(
    submittedNumber,
    message.author.id,
    message.guild.id,
    settings.current_number
  );

  // Protects against two messages being accepted at the same time
  if (result.changes === 0) {
    await message.delete().catch(() => null);

    const newestSettings = getCountingSettings(message.guild.id);
    const nextNumber = (newestSettings?.current_number ?? 0) + 1;

    const warning = await message.channel.send({
      content: `${message.author}, that number was already counted. The next number is **${nextNumber}**.`
    }).catch(() => null);

    if (warning) {
      setTimeout(() => {
        warning.delete().catch(() => null);
      }, 5000);
    }

    return true;
  }

  recordSuccessfulCount(
    message.guild.id,
    message.author.id,
    submittedNumber
  );

  await message.react("✅").catch(() => null);

  // Optional milestone messages
  if (submittedNumber % 100 === 0) {
    await message.channel.send({
      content: `🎉 The server has reached **${submittedNumber.toLocaleString()}**!`
    }).catch(() => null);
  }

  return true;
}

module.exports = {
  handleCountingMessage,
  setupCountingChannel,
  resetCounting,
  getCountingSettings,
  getUserCountingStats,
  getCountingLeaderboard
};
