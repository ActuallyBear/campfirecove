const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");
const { hasStaffPermission, staffRoleIds } = require("../utils/staffPermissions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock this channel."),

  async execute(interaction) {
    if (!hasStaffPermission(interaction)) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: null,
      SendMessagesInThreads: null,
      CreatePublicThreads: null,
      CreatePrivateThreads: null
    });

    for (const role of interaction.guild.roles.cache.values()) {
      if (role.id === interaction.guild.id || role.managed) continue;

      await channel.permissionOverwrites.edit(role, {
        SendMessages: null,
        SendMessagesInThreads: null,
        CreatePublicThreads: null,
        CreatePrivateThreads: null
      }).catch(() => null);
    }

    for (const roleId of staffRoleIds) {
      await channel.permissionOverwrites.edit(roleId, {
        ViewChannel: true,
        ReadMessageHistory: true,
        SendMessages: true,
        SendMessagesInThreads: true,
        CreatePublicThreads: true,
        CreatePrivateThreads: true
      }).catch(() => null);
    }

    await interaction.editReply({
      content: `🔓 ${channel} has been fully unlocked. Everyone should be able to talk again.`
    });

    await sendStaffLog(interaction.guild, {
      title: "🔓 Channel Unlocked",
      description: `${interaction.user} fully unlocked ${channel}.`,
      staff: interaction.user,
      extra: `**Channel:** ${channel}`,
      color: "#57F287"
    });
  }
};
