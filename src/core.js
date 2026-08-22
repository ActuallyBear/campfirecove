const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require("discord.js");
const db = require("./database");
const { channelByName, roleByName } = require("./install");

const embed = (title, description, color = "#E76F51") => new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setTimestamp().setFooter({ text: "Campfire Cove • Gather by the fire. Stay for the people." });

async function log(guild, title, description, color) {
  const channel = channelByName(guild, "staff-logs");
  if (channel) await channel.send({ embeds: [embed(title, description, color)] }).catch(() => null);
}

function isStaff(member) {
  const names = ["🔥 Owner", "🪵 Co-Owner", "🏕️ Management", "🛡️ Admin", "🌙 Senior Moderator", "✨ Moderator", "🌱 Trial Mod"];
  return member.permissions.has(PermissionFlagsBits.Administrator) || member.roles.cache.some(role => names.includes(role.name));
}

async function verify(interaction) {
  const role = roleByName(interaction.guild, "❤️ Member");
  if (!role) return interaction.reply({ content: "The Member role is missing.", ephemeral: true });
  if (interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: "You're already verified!", ephemeral: true });
  await interaction.member.roles.add(role);
  await log(interaction.guild, "✅ Member Verified", `${interaction.user} verified.`);
  return interaction.reply({ content: "🔥 Welcome to Campfire Cove!", ephemeral: true });
}

async function openTicket(interaction) {
  const existing = interaction.guild.channels.cache.find(c => c.topic === `ticket:${interaction.user.id}`);
  if (existing) return interaction.reply({ content: `You already have ${existing}.`, ephemeral: true });
  const category = interaction.guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === "🎫・SUPPORT");
  const staff = interaction.guild.roles.cache.filter(r => ["🔥 Owner", "🪵 Co-Owner", "🏕️ Management", "🛡️ Admin", "🌙 Senior Moderator", "✨ Moderator", "🌱 Trial Mod"].includes(r.name));
  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`.slice(0, 90), type: ChannelType.GuildText, parent: category?.id, topic: `ticket:${interaction.user.id}`,
    permissionOverwrites: [
      { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      ...staff.map(r => ({ id: r.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }))
    ]
  });
  await channel.send({ content: `${interaction.user}`, embeds: [embed("🎫 Support Ticket", "Tell the team what you need help with. Use `/close-ticket` when finished.")] });
  await log(interaction.guild, "🎫 Ticket Opened", `${interaction.user} opened ${channel}.`);
  return interaction.reply({ content: `Created ${channel}.`, ephemeral: true });
}

async function handleXP(message) {
  if (!message.guild || message.author.bot) return;
  const row = db.prepare("SELECT * FROM levels WHERE guild_id=? AND user_id=?").get(message.guild.id, message.author.id);
  const oldXp = row?.xp || 0, xp = oldXp + 10, messages = (row?.messages || 0) + 1;
  db.prepare("INSERT INTO levels(guild_id,user_id,xp,messages) VALUES(?,?,?,?) ON CONFLICT(guild_id,user_id) DO UPDATE SET xp=excluded.xp,messages=excluded.messages").run(message.guild.id, message.author.id, xp, messages);
  const oldLevel = Math.floor(Math.sqrt(oldXp / 50)), level = Math.floor(Math.sqrt(xp / 50));
  if (level > oldLevel) channelByName(message.guild, "levels")?.send(`🎉 ${message.author}, you reached **Level ${level}**!`).catch(() => null);
}

async function rank(interaction) {
  const user = interaction.options.getUser("user") || interaction.user;
  const row = db.prepare("SELECT * FROM levels WHERE guild_id=? AND user_id=?").get(interaction.guild.id, user.id) || { xp: 0, messages: 0 };
  const level = Math.floor(Math.sqrt(row.xp / 50));
  return interaction.reply({ embeds: [embed(`🔥 ${user.username}'s Rank`, `**Level:** ${level}\n**XP:** ${row.xp}\n**Messages:** ${row.messages}`)] });
}

async function leaderboard(interaction) {
  const rows = db.prepare("SELECT * FROM levels WHERE guild_id=? ORDER BY xp DESC LIMIT 10").all(interaction.guild.id);
  const text = rows.length ? rows.map((r, i) => `**${i + 1}.** <@${r.user_id}> — Level ${Math.floor(Math.sqrt(r.xp / 50))} (${r.xp} XP)`).join("\n") : "Nobody has earned XP yet.";
  return interaction.reply({ embeds: [embed("🏆 Leaderboard", text)] });
}

async function suggest(interaction) {
  const text = interaction.options.getString("suggestion");
  const result = db.prepare("INSERT INTO suggestions(guild_id,user_id,text) VALUES(?,?,?)").run(interaction.guild.id, interaction.user.id, text);
  const id = Number(result.lastInsertRowid), channel = channelByName(interaction.guild, "suggestions");
  const message = await channel.send({ embeds: [embed(`💡 Suggestion #${id}`, `${text}\n\nSuggested by ${interaction.user}\n👍 0  •  👎 0`)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`vote:${id}:up`).setLabel("Upvote").setEmoji("👍").setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId(`vote:${id}:down`).setLabel("Downvote").setEmoji("👎").setStyle(ButtonStyle.Danger))] });
  db.prepare("UPDATE suggestions SET message_id=? WHERE id=?").run(message.id, id);
  return interaction.reply({ content: `Posted in ${channel}.`, ephemeral: true });
}

async function vote(interaction) {
  const [, id, choice] = interaction.customId.split(":");
  db.prepare("INSERT INTO votes(suggestion_id,user_id,vote) VALUES(?,?,?) ON CONFLICT(suggestion_id,user_id) DO UPDATE SET vote=excluded.vote").run(id, interaction.user.id, choice);
  const counts = db.prepare("SELECT SUM(vote='up') up,SUM(vote='down') down FROM votes WHERE suggestion_id=?").get(id);
  const suggestion = db.prepare("SELECT * FROM suggestions WHERE id=?").get(id);
  return interaction.update({ embeds: [embed(`💡 Suggestion #${id}`, `${suggestion.text}\n\nSuggested by <@${suggestion.user_id}>\n👍 ${counts.up || 0}  •  👎 ${counts.down || 0}`)], components: interaction.message.components });
}

async function counting(message) {
  const state = db.prepare("SELECT * FROM counting WHERE guild_id=?").get(message.guild?.id);
  if (!state || message.channel.id !== state.channel_id || message.author.bot) return false;
  const number = Number(message.content.trim());
  if (number !== state.current + 1 || state.last_user_id === message.author.id) {
    await message.react("❌").catch(() => null);
    db.prepare("UPDATE counting SET current=0,last_user_id=NULL WHERE guild_id=?").run(message.guild.id);
    await message.channel.send(`The count was broken by ${message.author}. Start again at **1**.`);
  } else {
    db.prepare("UPDATE counting SET current=?,last_user_id=? WHERE guild_id=?").run(number, message.author.id, message.guild.id);
    await message.react("✅").catch(() => null);
  }
  return true;
}

module.exports = { embed, log, isStaff, verify, openTicket, handleXP, rank, leaderboard, suggest, vote, counting };
