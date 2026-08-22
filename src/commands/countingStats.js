const {
  SlashCommandBuilder
} = require("discord.js");

const {
  getCountingSettings,
  getUserCountingStats,
  getCountingLeaderboard
} = require("../features/counting");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("counting-stats")
    .setDescription("View counting statistics.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The member whose statistics you want to view")
        .setRequired(false)
    ),

  async execute(interaction) {
    const selectedUser =
      interaction.options.getUser("user") ??
      interaction.user;

    const settings = getCountingSettings(interaction.guild.id);

    if (!settings) {
      return interaction.reply({
        content: "❌ Counting has not been set up yet.",
        ephemeral: true
      });
    }

    const userStats = getUserCountingStats(
      interaction.guild.id,
      selectedUser.id
    );

    const leaderboard = getCountingLeaderboard(
      interaction.guild.id,
      10
    );

    const leaderboardText = leaderboard.length
      ? leaderboard
          .map((entry, index) => {
            return `**${index + 1}.** <@${entry.user_id}> — ${entry.successful_counts.toLocaleString()} counts`;
          })
          .join("\n")
      : "Nobody has counted yet.";

    await interaction.reply({
      embeds: [
        {
          color: 0x9b59b6,
          title: "🔢 Counting Statistics",
          fields: [
            {
              name: "Current Server Count",
              value: settings.current_number.toLocaleString(),
              inline: true
            },
            {
              name: `${selectedUser.username}'s Counts`,
              value: (
                userStats?.successful_counts ?? 0
              ).toLocaleString(),
              inline: true
            },
            {
              name: `${selectedUser.username}'s Highest Number`,
              value: (
                userStats?.highest_count ?? 0
              ).toLocaleString(),
              inline: true
            },
            {
              name: "Leaderboard",
              value: leaderboardText
            }
          ],
          thumbnail: {
            url: selectedUser.displayAvatarURL()
          },
          footer: {
            text: "Campfire Cove • Gather by the fire. Stay for the people."
          }
        }
      ]
    });
  }
};
