const { EmbedBuilder } = require("discord.js");
const { getRank, getUserPosition, xpNeeded } = require("../features/levels");

async function execute(interaction) {
  const target = interaction.options.getUser("user") || interaction.user;
  const stats = getRank(interaction.guild.id, target.id);
  const position = getUserPosition(interaction.guild.id, target.id);
  const needed = xpNeeded(stats.level);

  const embed = new EmbedBuilder()
    .setColor("#E76F51")
    .setTitle(`🌟 ${target.username}'s Rank`)
    .setThumbnail(target.displayAvatarURL())
    .setDescription(
      `**Rank:** #${position || "Unranked"}\n` +
      `**Level:** ${stats.level}\n` +
      `**XP:** ${stats.xp}/${needed}\n` +
      `**Messages Counted:** ${stats.messages}`
    )
    .setFooter({ text: "Campfire Cove • Level System" })
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}

module.exports = { execute };
