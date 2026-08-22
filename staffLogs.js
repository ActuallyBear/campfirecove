const { sendStaffLog } = require("../utils/staffLogs");

function trimText(text, max = 1000) {
  if (!text) return "*No text content / attachment only*";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function setupStaffLogs(client) {
  client.on("messageDelete", async message => {
    if (!message.guild || message.author?.bot) return;

    await sendStaffLog(message.guild, {
      title: "🗑️ Message Deleted",
      description: `A message was deleted in ${message.channel}.`,
      user: message.author,
      extra:
        `👤 **User:** ${message.author} (${message.author.tag})\n` +
        `📍 **Channel:** ${message.channel}\n\n` +
        `💬 **Message:**\n${trimText(message.content)}`,
      color: "#EF4444"
    });
  });

  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    await sendStaffLog(oldMessage.guild, {
      title: "✏️ Message Edited",
      description: `A message was edited in ${oldMessage.channel}.`,
      user: oldMessage.author,
      extra:
        `👤 **User:** ${oldMessage.author} (${oldMessage.author.tag})\n` +
        `📍 **Channel:** ${oldMessage.channel}\n\n` +
        `**Before:**\n${trimText(oldMessage.content)}\n\n` +
        `**After:**\n${trimText(newMessage.content)}`,
      color: "#F59E0B"
    });
  });

  client.on("guildBanAdd", async ban => {
    await sendStaffLog(ban.guild, {
      title: "🔨 Member Banned",
      description: `${ban.user} was banned from the server.`,
      user: ban.user,
      extra: `👤 **User:** ${ban.user.tag}`,
      color: "#DC2626"
    });
  });

  client.on("guildBanRemove", async ban => {
    await sendStaffLog(ban.guild, {
      title: "🔓 Member Unbanned",
      description: `${ban.user} was unbanned from the server.`,
      user: ban.user,
      extra: `👤 **User:** ${ban.user.tag}`,
      color: "#22C55E"
    });
  });

  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.nickname !== newMember.nickname) {
      await sendStaffLog(newMember.guild, {
        title: "📝 Nickname Changed",
        description: `${newMember.user} changed nickname.`,
        user: newMember.user,
        extra:
          `**Before:** ${oldMember.nickname || oldMember.user.username}\n` +
          `**After:** ${newMember.nickname || newMember.user.username}`,
        color: "#F59E0B"
      });
    }

    const addedRoles = newMember.roles.cache.filter(
      role => !oldMember.roles.cache.has(role.id)
    );

    const removedRoles = oldMember.roles.cache.filter(
      role => !newMember.roles.cache.has(role.id)
    );

    if (addedRoles.size > 0) {
      await sendStaffLog(newMember.guild, {
        title: "✅ Role Added",
        description: `${newMember.user} was given a role.`,
        user: newMember.user,
        extra: `🎭 **Role:** ${addedRoles.map(role => role.name).join(", ")}`,
        color: "#22C55E"
      });
    }

    if (removedRoles.size > 0) {
      await sendStaffLog(newMember.guild, {
        title: "❌ Role Removed",
        description: `${newMember.user} had a role removed.`,
        user: newMember.user,
        extra: `🎭 **Role:** ${removedRoles.map(role => role.name).join(", ")}`,
        color: "#EF4444"
      });
    }
  });

  client.on("channelCreate", async channel => {
    if (!channel.guild) return;

    await sendStaffLog(channel.guild, {
      title: "➕ Channel Created",
      description: `A channel was created: ${channel}`,
      color: "#22C55E"
    });
  });

  client.on("channelDelete", async channel => {
    if (!channel.guild) return;

    await sendStaffLog(channel.guild, {
      title: "➖ Channel Deleted",
      description: `A channel was deleted: **${channel.name}**`,
      color: "#EF4444"
    });
  });

  client.on("roleCreate", async role => {
    await sendStaffLog(role.guild, {
      title: "➕ Role Created",
      description: `A role was created: **${role.name}**`,
      color: "#22C55E"
    });
  });

  client.on("roleDelete", async role => {
    await sendStaffLog(role.guild, {
      title: "➖ Role Deleted",
      description: `A role was deleted: **${role.name}**`,
      color: "#EF4444"
    });
  });
}

module.exports = {
  setupStaffLogs
};
