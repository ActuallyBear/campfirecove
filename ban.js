const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The member to ban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName("delete-days")
        .setDescription("Delete their messages from the last 0-7 days")
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(7)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";
    const deleteDays = interaction.options.getInteger("delete-days") ?? 0;

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (member && !member.bannable) {
      return interaction.reply({
        content: "❌ I can't ban this member. Their role may be higher than mine.",
        ephemeral: true
      });
    }

    await interaction.guild.members.ban(user.id, {
      reason,
      deleteMessageSeconds: deleteDays * 24 * 60 * 60
    });

    await interaction.reply({
      content: `🔨 ${user} has been banned.\nReason: ${reason}`
    });

    await sendStaffLog(interaction.guild, {
      title: "🔨 Member Banned",
      description: `${interaction.user} banned ${user}.`,
      staff: interaction.user,
      user,
      extra:
        `**Reason:** ${reason}\n` +
        `**Deleted Messages:** ${deleteDays} day(s)`,
      color: "#DC2626"
    });
  }
};
