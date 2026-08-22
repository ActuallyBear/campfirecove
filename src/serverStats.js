const { ChannelType, PermissionFlagsBits } = require("discord.js");

const STATISTICS_CATEGORY = "📊・SERVER STATISTICS";

function values(guild) {
  return [
    ["👥 Members:", `👥 Members: ${guild.memberCount}`],
    ["🧑 Humans:", `🧑 Humans: ${guild.members.cache.filter(member => !member.user.bot).size}`],
    ["🤖 Bots:", `🤖 Bots: ${guild.members.cache.filter(member => member.user.bot).size}`],
    ["💜 Boosts:", `💜 Boosts: ${guild.premiumSubscriptionCount || 0}`],
    ["📅 Created:", `📅 Created: ${new Date(guild.createdTimestamp).getFullYear()}`]
  ];
}

async function getCategory(guild) {
  let category = guild.channels.cache.find(
    channel => channel.type === ChannelType.GuildCategory && channel.name === STATISTICS_CATEGORY
  );
  if (!category) {
    category = await guild.channels.create({
      name: STATISTICS_CATEGORY,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          allow: [PermissionFlagsBits.ViewChannel],
          deny: [PermissionFlagsBits.Connect]
        }
      ],
      reason: "Campfire Cove server statistics"
    });
  }
  return category;
}

async function setupServerStats(guild) {
  await guild.members.fetch();
  const category = await getCategory(guild);
  let created = 0;

  for (const [prefix, name] of values(guild)) {
    let channel = guild.channels.cache.find(
      item => item.parentId === category.id && item.name.startsWith(prefix)
    );
    if (!channel) {
      channel = await guild.channels.create({
        name,
        type: ChannelType.GuildVoice,
        parent: category.id,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.Connect]
          }
        ],
        reason: "Campfire Cove server statistics"
      });
      created++;
    } else if (channel.name !== name) {
      await channel.setName(name);
    }
  }
  return created;
}

async function updateServerStats(guild) {
  const category = guild.channels.cache.find(
    channel => channel.type === ChannelType.GuildCategory && channel.name === STATISTICS_CATEGORY
  );
  if (!category) return;

  for (const [prefix, name] of values(guild)) {
    const channel = guild.channels.cache.find(
      item => item.parentId === category.id && item.name.startsWith(prefix)
    );
    if (channel && channel.name !== name) await channel.setName(name).catch(() => null);
  }
}

module.exports = { setupServerStats, updateServerStats };
