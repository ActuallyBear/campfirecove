const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

const allowedRoles = [
  "1521148642419933305", // Trial Mod
  "1521148641325223936", // Moderator
  "1521148639559553044", // Senior Moderator
  "1521148638556983428"  // Admin
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode for this channel.")
    .addIntegerOption(option =>
      option
        .setName("seconds")
        .setDescription("Slowmode in seconds. Use 0 to disable.")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    ),

  async execute(interaction) {
    const hasAllowedRole = interaction.member.roles.cache.some(role =>
      allowedRoles.includes(role.id)
    );

    if (!hasAllowedRole) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    const seconds = interaction.options.getInteger("seconds");

    await interaction.channel.setRateLimitPerUser(seconds);

    await interaction.reply({
      content:
        seconds === 0
          ? `✅ Slowmode disabled in ${interaction.channel}.`
          : `⏱️ Slowmode set to **${seconds} seconds** in ${interaction.channel}.`
    });

    await sendStaffLog(interaction.guild, {
      title: "⏱️ Slowmode Updated",
      description: `${interaction.user} updated slowmode in ${interaction.channel}.`,
      staff: interaction.user,
      extra: `**Slowmode:** ${seconds} seconds`,
      color: "#F59E0B"
    });
  }
};
