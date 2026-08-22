const { coveEmbed } = require("./embed");
const { findChannel } = require("./finders");

async function sendLog(guild, title, message, color = "#60A5FA") {
  const logChannel =
    findChannel(guild, "⚙️・bot-logs") ||
    findChannel(guild, "bot-logs");

  if (!logChannel) return;

  return logChannel.send({
    embeds: [coveEmbed(title, message, color)]
  });
}

module.exports = {
  sendLog
};
