const db = require("../database/database");

const LEVELS_CHANNEL_ID = "1521148752759361648";

db.prepare(`
  CREATE TABLE IF NOT EXISTS levels (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    messages INTEGER DEFAULT 0,
    PRIMARY KEY (guild_id, user_id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS level_rewards (
    guild_id TEXT NOT NULL,
    level INTEGER NOT NULL,
    role_id TEXT NOT NULL,
    PRIMARY KEY (guild_id, level)
  )
`).run();

const cooldowns = new Map();

function xpNeeded(level) {
  return 50 * level * level;
}

function getUser(guildId, userId) {
  let user = db.prepare(`
    SELECT * FROM levels
    WHERE guild_id = ? AND user_id = ?
  `).get(guildId, userId);

  if (!user) {
    db.prepare(`
      INSERT INTO levels (guild_id, user_id, xp, level, messages)
      VALUES (?, ?, 0, 1, 0)
    `).run(guildId, userId);

    user = {
      guild_id: guildId,
      user_id: userId,
      xp: 0,
      level: 1,
      messages: 0
    };
  }

  return {
    xp: user.xp,
    level: user.level,
    messages: user.messages
  };
}

async function handleMessageXP(message) {
  if (!message.guild || message.author.bot) return;

  const key = `${message.guild.id}-${message.author.id}`;
  if (cooldowns.has(key)) return;

  cooldowns.set(key, true);
  setTimeout(() => cooldowns.delete(key), 60000);

  const userData = getUser(message.guild.id, message.author.id);

  const gainedXP = Math.floor(Math.random() * 11) + 15;

  let xp = userData.xp + gainedXP;
  let level = userData.level;
  let messages = userData.messages + 1;

  const needed = xpNeeded(level);

  if (xp >= needed) {
    xp -= needed;
    level += 1;

    const levelChannel =
      message.guild.channels.cache.get(LEVELS_CHANNEL_ID) || message.channel;

    const reward = getLevelReward(message.guild.id, level);

    if (reward) {
      const member = await message.guild.members.fetch(message.author.id);
      const role = message.guild.roles.cache.get(reward.roleId);

      if (role && !member.roles.cache.has(reward.roleId)) {
        await member.roles.add(reward.roleId);
      }

      if (role) {
        await levelChannel.send({
          content: `🎉 GG ${message.author}, you reached **Level ${level}** and earned **${role.name}**!`,
          allowedMentions: {
            users: [message.author.id],
            roles: []
          }
        });
      } else {
        await levelChannel.send({
          content: `🎉 GG ${message.author}, you reached **Level ${level}**!`,
          allowedMentions: {
            users: [message.author.id]
          }
        });
      }
    } else {
      await levelChannel.send({
        content: `🎉 GG ${message.author}, you reached **Level ${level}**!`,
        allowedMentions: {
          users: [message.author.id]
        }
      });
    }
  }

  db.prepare(`
    UPDATE levels
    SET xp = ?, level = ?, messages = ?
    WHERE guild_id = ? AND user_id = ?
  `).run(xp, level, messages, message.guild.id, message.author.id);
}

function getRank(guildId, userId) {
  return getUser(guildId, userId);
}

function getLeaderboard(guildId) {
  return db.prepare(`
    SELECT user_id as userId, xp, level, messages
    FROM levels
    WHERE guild_id = ?
    ORDER BY level DESC, xp DESC
    LIMIT 10
  `).all(guildId);
}

function getUserPosition(guildId, userId) {
  const leaderboard = db.prepare(`
    SELECT user_id AS userId
    FROM levels
    WHERE guild_id = ?
    ORDER BY level DESC, xp DESC
  `).all(guildId);

  const index = leaderboard.findIndex(user => user.userId === userId);

  return index === -1 ? null : index + 1;
}

function saveLevelReward(guildId, level, roleId) {
  db.prepare(`
    INSERT INTO level_rewards (guild_id, level, role_id)
    VALUES (?, ?, ?)
    ON CONFLICT(guild_id, level)
    DO UPDATE SET role_id = excluded.role_id
  `).run(guildId, level, roleId);
}

function getLevelReward(guildId, level) {
  return db.prepare(`
    SELECT role_id AS roleId
    FROM level_rewards
    WHERE guild_id = ? AND level = ?
  `).get(guildId, level);
}

module.exports = {
  handleMessageXP,
  getRank,
  getLeaderboard,
  getUserPosition,
  saveLevelReward,
  getLevelReward,
  xpNeeded
};
