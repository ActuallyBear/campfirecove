const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

const {
  resetCounting,
  getCountingSettings
} = require("../features/counting");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("counting-reset")
    .setDescription("Reset the server counting number back to zero.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const settings = getCountingSettings(interaction.guild.id);

    if (!settings) {
      return interaction.reply({
        content: "❌ Counting has not been set up yet.",
        ephemeral: true
      });
    }

    resetCounting(interaction.guild.id);

    await interaction.reply({
      content: "✅ The counting number has been reset. The next number is **1**.",
      ephemeral: true
    });

    const countingChannel = interaction.guild.channels.cache.get(
      settings.channel_id
    );

    if (countingChannel?.isTextBased()) {
      await countingChannel.send({
        content: "🔄 The counting game has been reset by staff. The next number is **1**."
      });
    }
  }
};
