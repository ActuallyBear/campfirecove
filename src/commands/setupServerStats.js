const { PermissionsBitField } = require("discord.js");
const { setupServerStats } = require("../features/serverStats");

async function execute(interaction) {
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return interaction.reply({
      content: "You need Administrator permission to use this.",
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  await setupServerStats(interaction.guild);

  return interaction.editReply({
    content: "✅ Server statistics category and channels have been created."
  });
}

module.exports = { execute };
