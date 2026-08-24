require("dotenv").config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const admin = PermissionFlagsBits.Administrator;
const commands = [
  new SlashCommandBuilder().setName("install-campfire-cove").setDescription("Safely create the complete Campfire Cove server.").setDefaultMemberPermissions(admin),
  new SlashCommandBuilder().setName("setup-role-panels").setDescription("Post self-role, colour and notification panels.").setDefaultMemberPermissions(admin),
  new SlashCommandBuilder().setName("setup-public-panels").setDescription("Post welcome, rules, verification and ticket panels.").setDefaultMemberPermissions(admin),
  new SlashCommandBuilder().setName("setup-server-stats").setDescription("Create live server statistic counters.").setDefaultMemberPermissions(admin),
  new SlashCommandBuilder().setName("setup-channel-topics").setDescription("Apply descriptions to every Campfire Cove channel.").setDefaultMemberPermissions(admin),
  new SlashCommandBuilder().setName("ticket").setDescription("Open a support ticket."),
  new SlashCommandBuilder().setName("close-ticket").setDescription("Close the current support ticket."),
  new SlashCommandBuilder().setName("rank").setDescription("View a member's rank.").addUserOption(o=>o.setName("user").setDescription("Member").setRequired(false)),
  new SlashCommandBuilder().setName("leaderboard").setDescription("View the XP leaderboard."),
  new SlashCommandBuilder().setName("suggest").setDescription("Submit a suggestion.").addStringOption(o=>o.setName("suggestion").setDescription("Your idea").setRequired(true).setMaxLength(1000)),
  new SlashCommandBuilder().setName("quote").setDescription("Quote a message.").addStringOption(o=>o.setName("message-link").setDescription("Discord message link").setRequired(true)),
  new SlashCommandBuilder().setName("setup-counting").setDescription("Choose the counting channel.").setDefaultMemberPermissions(admin).addChannelOption(o=>o.setName("channel").setDescription("Counting channel").setRequired(true).addChannelTypes(ChannelType.GuildText)),
  new SlashCommandBuilder().setName("warn").setDescription("Warn a member.").addUserOption(o=>o.setName("user").setDescription("Member").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("Reason").setRequired(true)),
  new SlashCommandBuilder().setName("warnings").setDescription("View warnings.").addUserOption(o=>o.setName("user").setDescription("Member").setRequired(true)),
  new SlashCommandBuilder().setName("removewarn").setDescription("Remove a warning.").addIntegerOption(o=>o.setName("id").setDescription("Warning ID").setRequired(true)),
  new SlashCommandBuilder().setName("kick").setDescription("Kick a member.").addUserOption(o=>o.setName("user").setDescription("Member").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("Reason")),
  new SlashCommandBuilder().setName("ban").setDescription("Ban a member.").addUserOption(o=>o.setName("user").setDescription("Member").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("Reason")),
  new SlashCommandBuilder().setName("timeout").setDescription("Timeout a member.").addUserOption(o=>o.setName("user").setDescription("Member").setRequired(true)).addIntegerOption(o=>o.setName("minutes").setDescription("Minutes").setRequired(true).setMinValue(1).setMaxValue(40320)).addStringOption(o=>o.setName("reason").setDescription("Reason")),
  new SlashCommandBuilder().setName("purge").setDescription("Delete recent messages.").addIntegerOption(o=>o.setName("amount").setDescription("1-100").setRequired(true).setMinValue(1).setMaxValue(100)),
  new SlashCommandBuilder().setName("slowmode").setDescription("Set channel slowmode.").addIntegerOption(o=>o.setName("seconds").setDescription("0-21600").setRequired(true).setMinValue(0).setMaxValue(21600)),
  new SlashCommandBuilder().setName("lock").setDescription("Lock this channel."),
  new SlashCommandBuilder().setName("unlock").setDescription("Unlock this channel.")
].map(c=>c.toJSON());

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) throw new Error("DISCORD_TOKEN, CLIENT_ID and GUILD_ID are required.");
new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN).put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands }).then(() => console.log(`✅ Deployed ${commands.length} commands.`)).catch(error => { console.error(error); process.exitCode=1; });
