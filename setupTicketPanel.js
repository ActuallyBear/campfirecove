const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { coveEmbed } = require("../utils/embed");

module.exports = {
  name: "setup-ticket-panel",

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "You need Administrator permission.",
        ephemeral: true
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("Open Ticket")
        .setEmoji("🎫")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({
      embeds: [
        coveEmbed(
          "🎫 Campfire Cove Support",
          "Need help?\n\nClick the button below to open a private ticket with staff.",
          "#60A5FA"
        )
      ],
      components: [row]
    });

    return interaction.reply({
      content: "Ticket panel created.",
      ephemeral: true
    });
  }
};
