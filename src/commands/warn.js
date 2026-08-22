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
    .setName("warn")
    .setDescription("Warn a member.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to warn").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason for the warning").setRequired(true)
    ),

  async execute(interaction) {
    if (!hasStaffPermission(interaction)) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true
      });
    }

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const data = loadWarnings();

    if (!data[interaction.guild.id]) data[interaction.guild.id] = {};
    if (!data[interaction.guild.id][user.id]) data[interaction.guild.id][user.id] = [];

    const warning = {
      id: Date.now(),
      reason,
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      date: new Date().toISOString()
    };

    data[interaction.guild.id][user.id].push(warning);
    saveWarnings(data);

    const count = data[interaction.guild.id][user.id].length;

    await interaction.reply({
      content: `⚠️ ${user} has been warned.\nReason: ${reason}\nTotal warnings: **${count}**`
    });

    await sendStaffLog(interaction.guild, {
      title: "⚠️ Member Warned",
      description: `${interaction.user} warned ${user}.`,
      staff: interaction.user,
      user,
      extra: `**Reason:** ${reason}\n**Total Warnings:** ${count}`,
      color: "#F59E0B"
    });
  }
};
