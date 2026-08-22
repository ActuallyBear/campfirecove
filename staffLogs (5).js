const { EmbedBuilder } = require("discord.js");

const STAFF_LOG_CHANNEL_NAME = "•₊˚๑🌷│staff-logsˎˊ˗";

function findStaffLogChannel(guild) {
  return guild.channels.cache.find(
    channel => channel.name === STAFF_LOG_CHANNEL_NAME
  );
}

async function sendStaffLog(guild, options) {
  const channel = findStaffLogChannel(guild);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(options.title || "Staff Log")
    .setDescription(options.description || "No description provided.")
    .setColor(options.color || "#FFB6C1")
    .setTimestamp();

  if (options.user) {
    embed.setThumbnail(options.user.displayAvatarURL({ dynamic: true }));
  }

  if (options.extra) {
    embed.addFields({
      name: "Extra Info",
      value: options.extra
    });
  }

  await channel.send({ embeds: [embed] }).catch(console.error);
}

module.exports = {
  sendStaffLog
};
