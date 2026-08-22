const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const cfg = require("./config");

const roleByName = (guild, name) => guild.roles.cache.find(role => role.name.toLowerCase() === name.toLowerCase());
const channelByName = (guild, name) => guild.channels.cache.find(channel => channel.name.toLowerCase() === name.toLowerCase());

async function ensureRole(guild, name, color = "#99AAB5", hoist = false) {
  return roleByName(guild, name) || guild.roles.create({ name, color, hoist, reason: "Campfire Cove installation" });
}

async function ensureCategory(guild, name, overwrites = []) {
  return guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === name) ||
    guild.channels.create({ name, type: ChannelType.GuildCategory, permissionOverwrites: overwrites, reason: "Campfire Cove installation" });
}

async function ensureChannel(guild, category, name, type = ChannelType.GuildText, overwrites = []) {
  return guild.channels.cache.find(c => c.parentId === category.id && c.name.toLowerCase() === name.toLowerCase()) ||
    guild.channels.create({ name, type, parent: category.id, permissionOverwrites: overwrites, reason: "Campfire Cove installation" });
}

async function install(guild) {
  let roles = 0, categories = 0, channels = 0;
  const ensureCountedRole = async (spec, hoist = false) => {
    const existed = Boolean(roleByName(guild, spec[0]));
    const role = await ensureRole(guild, spec[0], spec[1], hoist);
    if (!existed) roles++;
    return role;
  };

  const staff = [];
  for (const spec of cfg.staffRoles) staff.push(await ensureCountedRole(spec, true));
  for (const spec of [...cfg.baseRoles, ...cfg.colours, ...cfg.levelRoles]) await ensureCountedRole(spec);
  for (const name of [...Object.values(cfg.selfRoleGroups).flat(), ...cfg.pingRoles]) await ensureCountedRole([name, "#99AAB5"]);

  for (const [categoryName, names] of cfg.categories) {
    const existed = guild.channels.cache.some(c => c.type === ChannelType.GuildCategory && c.name === categoryName);
    const category = await ensureCategory(guild, categoryName);
    if (!existed) categories++;
    for (const name of names) {
      const present = guild.channels.cache.some(c => c.parentId === category.id && c.name.toLowerCase() === name.toLowerCase());
      await ensureChannel(guild, category, name);
      if (!present) channels++;
    }
  }

  const voiceExists = guild.channels.cache.some(c => c.type === ChannelType.GuildCategory && c.name === "🔊・VOICE CHATS");
  const voice = await ensureCategory(guild, "🔊・VOICE CHATS");
  if (!voiceExists) categories++;
  for (const name of cfg.voiceCategory) {
    const present = guild.channels.cache.some(c => c.parentId === voice.id && c.name.toLowerCase() === name.toLowerCase());
    await ensureChannel(guild, voice, name, ChannelType.GuildVoice);
    if (!present) channels++;
  }

  const staffExists = guild.channels.cache.some(c => c.type === ChannelType.GuildCategory && c.name === "🛡️・STAFF");
  const staffOverwrites = [
    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
    ...staff.map(role => ({ id: role.id, allow: [PermissionFlagsBits.ViewChannel] }))
  ];
  const staffCategory = await ensureCategory(guild, "🛡️・STAFF", staffOverwrites);
  if (!staffExists) categories++;
  for (const name of cfg.staffChannels) {
    const present = guild.channels.cache.some(c => c.parentId === staffCategory.id && c.name === name);
    await ensureChannel(guild, staffCategory, name, ChannelType.GuildText, staffOverwrites);
    if (!present) channels++;
  }

  const verify = channelByName(guild, "verify");
  const oldPanel = await verify.messages.fetch({ limit: 50 }).catch(() => null);
  if (!oldPanel?.some(m => m.author.id === guild.members.me.id && m.components.some(r => r.components.some(c => c.customId === "verify_member")))) {
    await verify.send({
      embeds: [new EmbedBuilder().setColor("#E76F51").setTitle("🔥 Welcome to Campfire Cove").setDescription("Read the rules, then click below to join the community.").setFooter({ text: "Campfire Cove • Gather by the fire. Stay for the people." })],
      components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("verify_member").setLabel("Verify").setStyle(ButtonStyle.Success))]
    });
  }

  const rules = channelByName(guild, "rules");
  const hasRules = await rules.messages.fetch({ limit: 20 }).then(ms => ms.some(m => m.author.id === guild.members.me.id && m.embeds[0]?.title?.includes("Rules"))).catch(() => false);
  if (!hasRules) await rules.send({ embeds: [new EmbedBuilder().setColor("#E76F51").setTitle("🔥 Campfire Cove Rules • 18+").setDescription("1. Be respectful — no harassment, hate speech or discrimination.\n2. Keep drama out of the server and stop when staff ask.\n3. No spam, scams, unsolicited advertising or malicious links.\n4. Keep content in the correct channels.\n5. Protect personal information and respect boundaries.\n6. Follow Discord's Terms of Service.\n\nTwo warnings may lead to a kick. Severe behaviour may result in an immediate ban. Use a ticket to appeal a warning or moderation decision.") ] });

  return { roles, categories, channels };
}

module.exports = { install, roleByName, channelByName };
