const { EmbedBuilder } = require("discord.js");
const { getLeaderboard } = require("../features/levels");

async function execute(interaction) {
  const leaderboard = getLeaderboard(interaction.guild.id);

  if (!leaderboard.length) {
    return interaction.reply({
      content: "No one has earned XP yet.",
      ephemeral: true
    });
  }

  const description = leaderboard
    .map((user, index) => {
      return `**${index + 1}.** <@${user.userId}> — Level **${user.level}** | XP **${user.xp}**`;
    })
    .join("\n");

  const embed = new EmbedBuilder()
    .setColor("#F59E0B")
    .setTitle("🏆 Campfire Cove Leaderboard")
    .setDescription(description)
    .setFooter({ text: "Campfire Cove • Top 10 Members" })
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}

module.exports = { execute };
