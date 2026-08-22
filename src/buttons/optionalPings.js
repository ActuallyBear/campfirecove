const { OPTIONAL_PINGS } = require("../config/constants");

async function toggleOptionalPing(interaction) {
  const selectedPing = OPTIONAL_PINGS.find(
    ping => ping.id === interaction.customId
  );

  if (!selectedPing) return;

  const selectedRole = interaction.guild.roles.cache.get(selectedPing.roleId);

  if (!selectedRole) {
    return interaction.reply({
      content: "That notification role doesn't exist. Check the role ID in `roles.js`.",
      ephemeral: true
    });
  }

  if (interaction.member.roles.cache.has(selectedRole.id)) {
    await interaction.member.roles.remove(selectedRole);

    return interaction.reply({
      content: `Removed ${selectedPing.name}.`,
      ephemeral: true
    });
  }

  await interaction.member.roles.add(selectedRole);

  return interaction.reply({
    content: `Added ${selectedPing.name}.`,
    ephemeral: true
  });
}

module.exports = {
  toggleOptionalPing
};
