const {
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { BASE_ROLES, CHANNEL_LAYOUT, STAFF_ROLES } = require("../config/serverConfig");
const { getOrCreateRole } = require("../utils/roles");
const { findRole, findChannel } = require("../utils/finders");
const { coveEmbed } = require("../utils/embed");

function permissionOverwrites(guild, type) {
  const everyone = guild.roles.everyone;
  const verified = findRole(guild, "✅ Verified");
  const muted = findRole(guild, "🔇 Muted");
  const staffRoles = STAFF_ROLES.map(name => findRole(guild, name)).filter(Boolean);
  const rows = [];

  if (type === "public") {
    rows.push({
      id: everyone.id,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
    });
  }

  if (type === "verified" || type === "voice") {
    rows.push({
      id: everyone.id,
      deny: [PermissionFlagsBits.ViewChannel]
    });

    if (verified) {
      rows.push({
        id: verified.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AddReactions,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak
        ]
      });
    }
  }

  if (type === "locked") {
    rows.push({
      id: everyone.id,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
      deny: [PermissionFlagsBits.SendMessages]
    });

    for (const staffRole of staffRoles) {
      rows.push({
        id: staffRole.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages
        ]
      });
    }
  }

  if (type === "staff") {
    rows.push({
      id: everyone.id,
      deny: [PermissionFlagsBits.ViewChannel]
    });

    for (const staffRole of staffRoles) {
      rows.push({
        id: staffRole.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages
        ]
      });
    }
  }

  if (muted) {
    rows.push({
      id: muted.id,
      deny: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.Speak,
        PermissionFlagsBits.AddReactions
      ]
    });
  }

  return rows;
}

async function installCampfireCove(guild) {
  for (const [name, color, hoist] of BASE_ROLES) {
    await getOrCreateRole(guild, name, color, hoist);
  }

  for (const [categoryName, categoryType, channels] of CHANNEL_LAYOUT) {
    let category = guild.channels.cache.find(
      channel => channel.name === categoryName && channel.type === ChannelType.GuildCategory
    );

    if (!category) {
      category = await guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory,
        permissionOverwrites: permissionOverwrites(guild, categoryType)
      });
    }

    for (const [channelName, channelType] of channels) {
      if (findChannel(guild, channelName)) continue;

      await guild.channels.create({
        name: channelName,
        type: channelType === "voice" ? ChannelType.GuildVoice : ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: permissionOverwrites(guild, channelType)
      });
    }
  }

  await sendStarterEmbeds(guild);
}

async function sendStarterEmbeds(guild) {
  const rules = findChannel(guild, "📜・rules");
  const guide = findChannel(guild, "✨・server-guide");
  const verify = findChannel(guild, "✅・verify");
  const tickets = findChannel(guild, "🎫・create-ticket");

  if (rules) {
    await rules.send({
      embeds: [
        coveEmbed(
          "📜 Campfire Cove Rules",
          "1. Be respectful.\n2. No harassment or hate speech.\n3. No spam.\n4. No NSFW in public channels.\n5. No advertising outside allowed channels.\n6. Do not share private information.\n7. Use channels properly.\n8. Follow Discord ToS.\n9. Listen to staff.\n10. Keep Campfire Cove friendly and fun."
        )
      ]
    });
  }

  if (guide) {
    await guide.send({
      embeds: [
        coveEmbed(
          "✨ Welcome to Campfire Cove",
          "Campfire Cove is a friendly social community for chatting, gaming, music, movie nights, events and meeting new people.\n\nVerify first, pick your roles, then say hello."
        )
      ]
    });
  }

  if (verify) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify_member")
        .setLabel("Verify")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success)
    );

    await verify.send({
      embeds: [coveEmbed("✅ Verify", "Click below to verify and unlock Campfire Cove.", "#22C55E")],
      components: [row]
    });
  }

  if (tickets) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("Open Ticket")
        .setEmoji("🎫")
        .setStyle(ButtonStyle.Primary)
    );

    await tickets.send({
      embeds: [coveEmbed("🎫 Support Tickets", "Need help? Click below to open a private ticket with staff.", "#60A5FA")],
      components: [row]
    });
  }
}

module.exports = { installCampfireCove };
