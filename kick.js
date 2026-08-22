const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");

const allowedRoles = [
  "1521148641325223936", // Moderator
  "1521148639559553044", // Senior Moderator
  "1521148638556983428"  // Admin
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to kick").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason for the kick").setRequired(false)
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

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ I couldn't find that member in this server.",
        ephemeral: true
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "❌ I can't kick this member. Their role may be higher than mine.",
        ephemeral: true
      });
    }

    await member.kick(reason);

    await interaction.reply({
      content: `👢 ${user} has been kicked.\nReason: ${reason}`
    });

    await sendStaffLog(interaction.guild, {
      title: "👢 Member Kicked",
      description: `${interaction.user} kicked ${user}.`,
      staff: interaction.user,
      user,
      extra: `**Reason:** ${reason}`,
      color: "#EF4444"
    });
  }
};
