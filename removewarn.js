const fs = require("node:fs");
const path = require("node:path");
const { SlashCommandBuilder } = require("discord.js");
const { sendStaffLog } = require("../utils/staffLogs");
const { hasStaffPermission } = require("../utils/staffPermissions");

const warningsPath = path.join(__dirname, "..", "data", "warnings.json");

function loadWarnings() {
  if (!fs.existsSync(warningsPath)) return {};
  return JSON.parse(fs.readFileSync(warningsPath, "utf8"));
}

function saveWarnings(data) {
  fs.writeFileSync(warningsPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remove a specific warning from a member.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The member")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("warning-id")
        .setDescription("The warning ID to remove")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!hasStaffPermission(interaction)) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    const user = interaction.options.getUser("user");
    const warningId = interaction.options.getString("warning-id");

    const data = loadWarnings();
    const warnings = data[interaction.guild.id]?.[user.id] || [];

    const index = warnings.findIndex(warn => String(warn.id) === warningId);

    if (index === -1) {
      return interaction.reply({
        content: "❌ I couldn't find that warning ID for this member.",
        ephemeral: true
      });
    }

    const removed = warnings.splice(index, 1)[0];

    data[interaction.guild.id][user.id] = warnings;
    saveWarnings(data);

    await interaction.reply({
      content: `✅ Removed warning \`${warningId}\` from ${user}.\nRemaining warnings: **${warnings.length}**`,
      ephemeral: true
    });

    await sendStaffLog(interaction.guild, {
      title: "🗑️ Warning Removed",
      description: `${interaction.user} removed a warning from ${user}.`,
      staff: interaction.user,
      user,
      extra:
        `**Warning ID:** ${warningId}\n` +
        `**Old Reason:** ${removed.reason}\n` +
        `**Remaining Warnings:** ${warnings.length}`,
      color: "#22C55E"
    });
  }
};
