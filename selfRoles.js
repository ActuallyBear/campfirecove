const { SELF_ROLES } = require("../config/constants");

async function toggleSelfRole(interaction) {
  const selected = SELF_ROLES.find(role => role.id === interaction.customId);

  if (!selected) {
    return interaction.reply({
      content: "❌ This role button is outdated. Ask staff to repost the role panel.",
      ephemeral: true
    });
  }

  const role = interaction.guild.roles.cache.get(selected.roleId);

  if (!role) {
    return interaction.reply({
      content: "❌ I couldn't find that role. Check the role ID in `roles.js`.",
      ephemeral: true
    });
  }

  const singleChoiceGroups = [
  "age",
  "gender",
  "pronouns",
  "sexuality",
  "location",
  "relationship",
  "dms"
];

  if (singleChoiceGroups.includes(selected.group)) {
    const rolesToRemove = SELF_ROLES
      .filter(item => item.group === selected.group)
      .map(item => interaction.guild.roles.cache.get(item.roleId))
      .filter(Boolean);

    await interaction.member.roles.remove(rolesToRemove).catch(() => null);
  }

  if (interaction.member.roles.cache.has(role.id)) {
    await interaction.member.roles.remove(role);

    return interaction.reply({
      content: `❌ Removed **${role.name}**.`,
      ephemeral: true
    });
  }

  await interaction.member.roles.add(role);

  return interaction.reply({
    content: `✅ Added **${role.name}**.`,
    ephemeral: true
  });
}

module.exports = { toggleSelfRole };
