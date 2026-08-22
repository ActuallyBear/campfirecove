const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} = require("discord.js");

const {
  setupCountingChannel
} = require("../features/counting");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-counting")
    .setDescription("Set up the server counting channel.")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("The channel members will count in")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    setupCountingChannel(
      interaction.guild.id,
      channel.id
    );

    await interaction.reply({
      content: `✅ The counting channel is now ${channel}.\n\nThe next number is **1**.`,
      ephemeral: true
    });

    await channel.send({
      embeds: [
        {
          color: 0x9b59b6,
          title: "🔢 Campfire Cove Counting",
          description: [
            "Count as high as you can together!",
            "",
            "### Rules",
            "• Start at **1** and count upwards.",
            "• Only send the next correct number.",
            "• You cannot count twice in a row.",
            "• Incorrect messages will be removed.",
            "",
            "The next number is **1**."
          ].join("\n"),
          footer: {
            text: "Campfire Cove • Gather by the fire. Stay for the people."
          }
        }
      ]
    });
  }
};
