require("dotenv").config();
const { Client, GatewayIntentBits, Partials, PermissionFlagsBits } = require("discord.js");
const db = require("./src/database");
const { install, channelByName } = require("./src/install");
const { setupPanels, toggleRole } = require("./src/panels");
const { setupPublicPanels } = require("./src/publicPanels");
const { setupServerStats, updateServerStats } = require("./src/serverStats");
const { applyChannelTopics } = require("./src/channelTopics");
const { setupApplicationPanels, showApplicationModal, submitApplication, decideApplication } = require("./src/applications");
const { postAnnouncement } = require("./src/announcements");
const { handleBumpConfirmation, initializeBumpReminders } = require("./src/bumpReminders");
const core = require("./src/core");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildModeration],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once("clientReady", ready => {
  console.log(`✅ Logged in as ${ready.user.tag}`);
  console.log(`✅ Connected to: ${ready.guilds.cache.map(g => `${g.name} (${g.id})`).join(", ")}`);
  initializeBumpReminders(ready);
});

client.on("guildMemberAdd", async member => {
  await updateServerStats(member.guild);
  await channelByName(member.guild, "general")?.send(`🔥 Welcome ${member} to **Campfire Cove**! You are member **#${member.guild.memberCount}**.`).catch(() => null);
  await core.log(member.guild, "📥 Member Joined", `${member.user.tag} joined. Member count: ${member.guild.memberCount}`, "#22C55E");
});
client.on("guildMemberRemove", async member => {
  await updateServerStats(member.guild);
  await core.log(member.guild, "📤 Member Left", `${member.user.tag} left. Member count: ${member.guild.memberCount}`, "#EF4444");
});
client.on("messageDelete", message => { if (message.guild && !message.author?.bot) core.log(message.guild, "🗑️ Message Deleted", `${message.author} in ${message.channel}:\n${message.content || "*attachment only*"}`, "#EF4444"); });
client.on("messageUpdate", (oldMessage, newMessage) => { if (oldMessage.guild && !oldMessage.author?.bot && oldMessage.content !== newMessage.content) core.log(oldMessage.guild, "✏️ Message Edited", `${oldMessage.author} in ${oldMessage.channel}\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`, "#F59E0B"); });

client.on("messageCreate", async message => {
  await handleBumpConfirmation(message);
  if (await core.counting(message)) return;
  await core.handleXP(message);
});

client.on("messageReactionAdd", async reaction => {
  if (reaction.partial) await reaction.fetch();
  if (reaction.emoji.name !== "⭐" || reaction.count < 5 || reaction.message.author?.bot) return;
  const board = channelByName(reaction.message.guild, "starboard");
  if (!board) return;
  const duplicate = await board.messages.fetch({ limit: 100 }).then(ms => ms.some(m => m.embeds[0]?.footer?.text === `starboard:${reaction.message.id}`)).catch(() => false);
  if (!duplicate) await board.send({ embeds: [core.embed(`⭐ ${reaction.count} stars`, `${reaction.message.content || "*attachment*"}\n\n[Jump to message](${reaction.message.url})`, "#FFD700").setAuthor({ name: reaction.message.author.username, iconURL: reaction.message.author.displayAvatarURL() }).setFooter({ text: `starboard:${reaction.message.id}` })] });
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === "verify_member") return core.verify(interaction);
      if (interaction.customId === "open_ticket") return core.openTicket(interaction);
      if (interaction.customId.startsWith("role:")) return toggleRole(interaction);
      if (interaction.customId.startsWith("vote:")) return core.vote(interaction);
      if (interaction.customId.startsWith("application:start:")) return showApplicationModal(interaction);
      if (interaction.customId.startsWith("application:decision:")) return decideApplication(interaction, core.isStaff);
    }
    if (interaction.isModalSubmit() && interaction.customId.startsWith("application:submit:")) return submitApplication(interaction);
    if (!interaction.isChatInputCommand()) return;
    const name = interaction.commandName;
    if (name === "install-campfire-cove") {
      await interaction.deferReply({ ephemeral: true });
      const result = await install(interaction.guild);
      return interaction.editReply(`✅ Setup complete: **${result.roles}** roles, **${result.categories}** categories and **${result.channels}** channels created. Nothing existing was deleted.`);
    }
    if (name === "setup-role-panels") {
      await interaction.deferReply({ ephemeral: true }); await setupPanels(interaction.guild); return interaction.editReply("✅ Self-role, colour and notification panels posted.");
    }
    if (name === "setup-public-panels") {
      await interaction.deferReply({ ephemeral: true });
      await setupPublicPanels(interaction.guild);
      return interaction.editReply("✅ Welcome, rules, verification and ticket panels posted.");
    }
    if (name === "setup-server-stats") {
      await interaction.deferReply({ ephemeral: true });
      const created = await setupServerStats(interaction.guild);
      return interaction.editReply(`✅ Server statistics are live. Created **${created}** missing counter(s).`);
    }
    if (name === "setup-channel-topics") {
      await interaction.deferReply({ ephemeral: true });
      const result = await applyChannelTopics(interaction.guild);
      const missing = result.missing.length ? ` Missing: ${result.missing.join(", ")}.` : "";
      return interaction.editReply(`✅ Channel descriptions applied. Updated **${result.updated}**; already correct **${result.unchanged}**.${missing}`);
    }
    if (name === "setup-application-panels") {
      await interaction.deferReply({ ephemeral: true });
      const result = await setupApplicationPanels(interaction.guild);
      return interaction.editReply(`✅ Staff and partnership application panels are live.${result.created ? " The staff-applications channel was created." : ""}`);
    }
    if (name === "announce") {
      await interaction.deferReply({ ephemeral: true });
      const result = await postAnnouncement(interaction);
      return interaction.editReply(`✅ ${result.template.label} posted in ${result.sent.channel}: ${result.sent.url}`);
    }
    if (name === "ticket") return core.openTicket(interaction);
    if (name === "close-ticket") { if (!interaction.channel.topic?.startsWith("ticket:")) return interaction.reply({ content: "Use this inside a ticket.", ephemeral: true }); await interaction.reply("Closing in 5 seconds..."); await core.log(interaction.guild, "🔒 Ticket Closed", `${interaction.user} closed ${interaction.channel}.`); return setTimeout(() => interaction.channel.delete("Ticket closed"), 5000); }
    if (name === "rank") return core.rank(interaction);
    if (name === "leaderboard") return core.leaderboard(interaction);
    if (name === "suggest") return core.suggest(interaction);
    if (name === "quote") { const link = interaction.options.getString("message-link"), match = link.match(/channels\/\d+\/(\d+)\/(\d+)/); if (!match) return interaction.reply({ content: "Paste a valid Discord message link.", ephemeral: true }); const channel = await interaction.guild.channels.fetch(match[1]), message = await channel.messages.fetch(match[2]); const target = channelByName(interaction.guild, "quotes"); await target.send({ embeds: [core.embed("💬 Quote", `${message.content || "*attachment*"}\n\n— ${message.author} in ${message.channel}`)] }); return interaction.reply({ content: `Quoted in ${target}.`, ephemeral: true }); }
    if (name === "setup-counting") { const channel = interaction.options.getChannel("channel"); db.prepare("INSERT INTO counting(guild_id,channel_id,current,last_user_id) VALUES(?,?,0,NULL) ON CONFLICT(guild_id) DO UPDATE SET channel_id=excluded.channel_id,current=0,last_user_id=NULL").run(interaction.guild.id, channel.id); return interaction.reply({ content: `✅ Counting enabled in ${channel}.`, ephemeral: true }); }
    if (["warn", "warnings", "removewarn", "kick", "ban", "timeout", "purge", "slowmode", "lock", "unlock"].includes(name) && !core.isStaff(interaction.member)) return interaction.reply({ content: "You don't have staff permission.", ephemeral: true });
    if (name === "warn") { const user = interaction.options.getUser("user"), reason = interaction.options.getString("reason"); const result = db.prepare("INSERT INTO warnings(guild_id,user_id,moderator_id,reason,created_at) VALUES(?,?,?,?,?)").run(interaction.guild.id,user.id,interaction.user.id,reason,Date.now()); await core.log(interaction.guild,"⚠️ Member Warned",`${interaction.user} warned ${user}.\n**Reason:** ${reason}`); return interaction.reply(`⚠️ ${user} warned. Warning ID: **${result.lastInsertRowid}**`); }
    if (name === "warnings") { const user = interaction.options.getUser("user"), rows = db.prepare("SELECT * FROM warnings WHERE guild_id=? AND user_id=? ORDER BY id DESC").all(interaction.guild.id,user.id); return interaction.reply({ embeds: [core.embed(`Warnings • ${user.username}`, rows.length ? rows.map(r => `**#${r.id}** — ${r.reason} • <@${r.moderator_id}>`).join("\n") : "No warnings.")] }); }
    if (name === "removewarn") { const id=interaction.options.getInteger("id"); db.prepare("DELETE FROM warnings WHERE id=? AND guild_id=?").run(id,interaction.guild.id); return interaction.reply(`✅ Warning #${id} removed.`); }
    if (name === "kick") { const member=interaction.options.getMember("user"), reason=interaction.options.getString("reason")||"No reason"; await member.kick(reason); await core.log(interaction.guild,"👢 Member Kicked",`${interaction.user} kicked ${member.user}.\n${reason}`); return interaction.reply(`👢 ${member.user.tag} kicked.`); }
    if (name === "ban") { const user=interaction.options.getUser("user"), reason=interaction.options.getString("reason")||"No reason"; await interaction.guild.members.ban(user,{reason}); await core.log(interaction.guild,"🔨 Member Banned",`${interaction.user} banned ${user}.\n${reason}`); return interaction.reply(`🔨 ${user.tag} banned.`); }
    if (name === "timeout") { const member=interaction.options.getMember("user"), minutes=interaction.options.getInteger("minutes"), reason=interaction.options.getString("reason")||"No reason"; await member.timeout(minutes*60000,reason); return interaction.reply(`⏳ ${member} timed out for ${minutes} minute(s).`); }
    if (name === "purge") { const amount=interaction.options.getInteger("amount"); const deleted=await interaction.channel.bulkDelete(amount,true); return interaction.reply({ content:`🧹 Deleted ${deleted.size} messages.`,ephemeral:true }); }
    if (name === "slowmode") { const seconds=interaction.options.getInteger("seconds"); await interaction.channel.setRateLimitPerUser(seconds); return interaction.reply(`✅ Slowmode set to ${seconds}s.`); }
    if (name === "lock" || name === "unlock") { const locked = name === "lock"; await core.setChannelLock(interaction.guild, interaction.channel, locked); return interaction.reply(`${locked ? "🔒" : "🔓"} Channel ${locked ? "locked" : "unlocked"}.`); }
  } catch (error) {
    console.error(error);
    const payload = { content: `❌ ${error.message}`, ephemeral: true };
    if (interaction.deferred || interaction.replied) return interaction.editReply(payload).catch(() => interaction.followUp(payload));
    return interaction.reply(payload).catch(() => null);
  }
});

console.log("DISCORD_TOKEN loaded:", Boolean(process.env.DISCORD_TOKEN));
client.login(process.env.DISCORD_TOKEN).catch(error => console.error("❌ Discord login failed:", error));
