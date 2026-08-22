const { COLOUR_ROLES } = require("../config/constants");

async function toggleColourRole(interaction) {
  const selectedColour = COLOUR_ROLES.find(
    colour => colour.id === interaction.customId
  );

  if (!selectedColour) {
    return interaction.reply({
      content: "❌ That colour option could not be found.",
      ephemeral: true
    });
  }

  const selectedRole = interaction.guild.roles.cache.get(
    selectedColour.roleId
  );

  if (!selectedRole) {
    return interaction.reply({
      content:
        "❌ That colour role does not exist. Check its role ID in `roles.js`.",
      ephemeral: true
    });
  }

  const colourRoleIds = COLOUR_ROLES
    .map(colour => colour.roleId)
    .filter(Boolean);

  const rolesToRemove = interaction.member.roles.cache
    .filter(role => {
      return (
        colourRoleIds.includes(role.id) &&
        role.id !== selectedRole.id
      );
    })
    .map(role => role.id);

  try {
    if (rolesToRemove.length > 0) {
      await interaction.member.roles.remove(
        rolesToRemove,
        "Member selected a different colour role"
      );
    }

    if (interaction.member.roles.cache.has(selectedRole.id)) {
      await interaction.member.roles.remove(
        selectedRole,
        "Member removed their colour role"
      );

      return interaction.reply({
        content: `✅ Removed ${selectedColour.name}.`,
        ephemeral: true
      });
    }

    await interaction.member.roles.add(
      selectedRole,
      "Member selected a colour role"
    );

    return interaction.reply({
      content: `✅ Your colour is now ${selectedColour.name}.`,
      ephemeral: true
    });
  } catch (error) {
    console.error("Colour role button error:", error);

    return interaction.reply({
      content:
        "❌ I couldn't update your colour role. Make sure my bot role is above all colour roles.",
      ephemeral: true
    });
  }
}

module.exports = {
  toggleColourRole
};
