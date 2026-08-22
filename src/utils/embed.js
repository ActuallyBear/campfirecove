const { EmbedBuilder } = require("discord.js");

function coveEmbed(title, message, color = "#E76F51") {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(message)
    .setFooter({
      text: "Campfire Cove • Gather by the fire. Stay for the people."
    })
    .setTimestamp();
}

module.exports = {
  coveEmbed
};
