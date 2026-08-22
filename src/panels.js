const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const cfg = require("./config");
const { channelByName, roleByName } = require("./install");

const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

async function postPanel(channel, title, roles, prefix, single = false) {
  const rows = [];
  for (let i = 0; i < roles.length; i += 5) {
    rows.push(new ActionRowBuilder().addComponents(...roles.slice(i, i + 5).map(name =>
      new ButtonBuilder().setCustomId(`role:${prefix}:${single ? "one" : "many"}:${slug(name)}`).setLabel(name.toLowerCase()).setStyle(ButtonStyle.Secondary)
    )));
  }
  await channel.send({ embeds: [new EmbedBuilder().setColor("#2B0B3F").setTitle(title).setDescription("Click a button to add or remove a role.")], components: rows });
}

async function setupPanels(guild) {
  await postPanel(channelByName(guild, "colour-roles"), "🎨 Colour Roles", cfg.colours.map(x => x[0]), "colour", true);
  await postPanel(channelByName(guild, "notification-roles"), "🔔 Optional Pings", cfg.pingRoles, "pings", false);
  const channel = channelByName(guild, "self-roles");
  for (const [group, roles] of Object.entries(cfg.selfRoleGroups)) {
    await postPanel(channel, group[0].toUpperCase() + group.slice(1), roles, group, !["interests", "games"].includes(group));
  }
}

async function toggleRole(interaction) {
  const [, group, mode, wantedSlug] = interaction.customId.split(":");
  const source = group === "colour" ? cfg.colours.map(x => x[0]) : group === "pings" ? cfg.pingRoles : cfg.selfRoleGroups[group];
  const name = source?.find(item => slug(item) === wantedSlug);
  const role = name && roleByName(interaction.guild, name);
  if (!role) return interaction.reply({ content: "That role is missing. Ask an admin to run `/install-campfire-cove` again.", ephemeral: true });
  if (mode === "one") {
    const ids = source.map(item => roleByName(interaction.guild, item)?.id).filter(Boolean);
    await interaction.member.roles.remove(ids.filter(id => id !== role.id)).catch(() => null);
  }
  if (interaction.member.roles.cache.has(role.id)) {
    await interaction.member.roles.remove(role);
    return interaction.reply({ content: `Removed **${role.name}**.`, ephemeral: true });
  }
  await interaction.member.roles.add(role);
  return interaction.reply({ content: `Added **${role.name}**.`, ephemeral: true });
}

module.exports = { setupPanels, toggleRole };
