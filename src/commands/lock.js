const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");
const { hasStaffPermission, staffRoleIds } = require("../utils/staffPermissions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock this channel so members cannot send messages."),

  async execute(interaction) {
    if (!hasStaffPermission(interaction)) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      ViewChannel: null,
      ReadMessageHistory: null,
      SendMessages: false,
      SendMessagesInThreads: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false
    });

    for (const roleId of staffRoleIds) {
      await channel.permissionOverwrites.edit(roleId, {
        ViewChannel: true,
        ReadMessageHistory: true,
        SendMessages: true,
        SendMessagesInThreads: true,
        CreatePublicThreads: true,
        CreatePrivateThreads: true
      });
    }

    await interaction.reply({
      content: `🔒 ${channel} has been locked. Staff can still talk.`
    });

    await sendStaffLog(interaction.guild, {
      title: "🔒 Channel Locked",
      description: `${interaction.user} locked ${channel}.`,
      staff: interaction.user,
      extra: `**Channel:** ${channel}`,
      color: "#EF4444"
    });
  }
};
