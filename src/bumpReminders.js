const db = require("./database");
const { channelByName, roleByName } = require("./install");

const TWO_HOURS = 2 * 60 * 60 * 1000;
const timers = new Map();

function combinedText(message) {
  return [
    message.content,
    ...message.embeds.flatMap(embed => [embed.title, embed.description, embed.footer?.text])
  ].filter(Boolean).join(" ").toLowerCase();
}

function isDisboardBump(message) {
  if (!message.guild || !message.author.bot || message.channel.name !== "bump") return false;
  const identity = `${message.author.username} ${message.author.tag}`.toLowerCase();
  const text = combinedText(message);
  return identity.includes("disboard") && (
    text.includes("bump done") ||
    text.includes("server bumped") ||
    text.includes("bumped successfully")
  );
}

function schedule(guild, channelId, nextAt) {
  const oldTimer = timers.get(guild.id);
  if (oldTimer) clearTimeout(oldTimer);

  const delay = Math.max(0, nextAt - Date.now());
  const timer = setTimeout(async () => {
    timers.delete(guild.id);
    const channel = guild.channels.cache.get(channelId) || channelByName(guild, "bump");
    const role = roleByName(guild, "Bump Reminder");
    if (channel?.isTextBased()) {
      await channel.send({
        content: `${role ? `${role} ` : ""}🔥 Campfire Cove can be bumped again! Please run **/bump** manually.`,
        allowedMentions: role ? { roles: [role.id] } : { parse: [] }
      }).catch(() => null);
    }
    db.prepare("UPDATE bump_reminders SET next_at=NULL WHERE guild_id=?").run(guild.id);
  }, Math.min(delay, 2_147_483_647));

  timers.set(guild.id, timer);
}

async function handleBumpConfirmation(message) {
  if (!isDisboardBump(message)) return false;
  const nextAt = Date.now() + TWO_HOURS;
  db.prepare(`
    INSERT INTO bump_reminders(guild_id,channel_id,next_at)
    VALUES(?,?,?)
    ON CONFLICT(guild_id) DO UPDATE SET channel_id=excluded.channel_id,next_at=excluded.next_at
  `).run(message.guild.id, message.channel.id, nextAt);
  schedule(message.guild, message.channel.id, nextAt);
  await message.react("🔥").catch(() => null);
  return true;
}

function initializeBumpReminders(client) {
  for (const guild of client.guilds.cache.values()) {
    const row = db.prepare("SELECT * FROM bump_reminders WHERE guild_id=? AND next_at IS NOT NULL").get(guild.id);
    if (row) schedule(guild, row.channel_id, row.next_at);
  }
}

module.exports = { handleBumpConfirmation, initializeBumpReminders };
