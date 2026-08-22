const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { COLOUR_ROLES, OPTIONAL_PINGS } = require("../config/serverConfig");
const { getOrCreateRole } = require("../utils/roles");
const { findRole, findChannel } = require("../utils/finders");
const { coveEmbed } = require("../utils/embed");

async function setupColourRoles(guild) {
  for (const colour of COLOUR_ROLES) {
    await getOrCreateRole(guild, colour.name, colour.hex, false, false);
  }

  const channel = findChannel(guild, "🎨・colour-roles");
  if (!channel) throw new Error("Missing colour roles channel.");

  const rows = [];
  let row = new ActionRowBuilder();

  COLOUR_ROLES.forEach((colour, index) => {
    if (index > 0 && index % 4 === 0) {
      rows.push(row);
      row = new ActionRowBuilder();
    }

    row.addComponents(
      new ButtonBuilder()
        .setCustomId(colour.id)
        .setLabel(colour.name)
        .setStyle(ButtonStyle.Secondary)
    );
  });

  rows.push(row);

  await channel.send({
    embeds: [
      coveEmbed(
        "🎨 Choose Your Colour",
        "Click a button below to choose your username colour.\n\nYou can only have one colour role at a time.",
        "#E76F51"
      )
    ],
    components: rows
  });
}

async function setupOptionalPings(guild) {
  for (const ping of OPTIONAL_PINGS) {
    await getOrCreateRole(guild, ping.name, "#F9A8D4", false, true);
  }

  const channel = findChannel(guild, "🔔・notification-roles");
  if (!channel) throw new Error("Missing notification roles channel.");

  const row = new ActionRowBuilder();

  for (const ping of OPTIONAL_PINGS) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(ping.id)
        .setLabel(ping.name)
        .setStyle(ButtonStyle.Secondary)
    );
  }

  await channel.send({
    embeds: [
      coveEmbed(
        "Optional Pings ♡₊˚",
        "Choose which notifications you'd like to receive!\n\n**Chat Revive** — when chat needs reviving.\n**VC Revive** — when people are joining voice chat.\n**Daily Question** — daily conversation starters.",
        "#F9A8D4"
      )
    ],
    components: [row]
  });
}

async function toggleColourRole(interaction) {
  const picked = COLOUR_ROLES.find(colour => colour.id === interaction.customId);
  if (!picked) return;

  const pickedRole = findRole(interaction.guild, picked.name);

  if (!pickedRole) {
    return interaction.reply({ content: "That colour role does not exist yet.", ephemeral: true });
  }

  const colourRoleIds = COLOUR_ROLES
    .map(colour => findRole(interaction.guild, colour.name))
    .filter(Boolean)
    .map(role => role.id);

  const rolesToRemove = interaction.member.roles.cache
    .filter(role => colourRoleIds.includes(role.id) && role.id !== pickedRole.id)
    .map(role => role.id);

  if (rolesToRemove.length > 0) {
    await interaction.member.roles.remove(rolesToRemove);
  }

  if (interaction.member.roles.cache.has(pickedRole.id)) {
    await interaction.member.roles.remove(pickedRole);
    return interaction.reply({ content: `Removed ${picked.name}.`, ephemeral: true });
  }

  await interaction.member.roles.add(pickedRole);
  return interaction.reply({ content: `Your colour is now ${picked.name}.`, ephemeral: true });
}

async function toggleOptionalPing(interaction) {
  const picked = OPTIONAL_PINGS.find(ping => ping.id === interaction.customId);
  if (!picked) return;

  const pickedRole = findRole(interaction.guild, picked.name);

  if (!pickedRole) {
    return interaction.reply({ content: "That ping role does not exist yet.", ephemeral: true });
  }

  if (interaction.member.roles.cache.has(pickedRole.id)) {
    await interaction.member.roles.remove(pickedRole);
    return interaction.reply({ content: `Removed ${picked.name}.`, ephemeral: true });
  }

  await interaction.member.roles.add(pickedRole);
  return interaction.reply({ content: `Added ${picked.name}.`, ephemeral: true });
}

module.exports = {
  setupColourRoles,
  setupOptionalPings,
  toggleColourRole,
  toggleOptionalPing
};
