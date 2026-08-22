const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");

const path = require("path");
const { COLOUR_ROLES } = require("../config/constants");

function cleanButtonLabel(name) {
  return name
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .toLowerCase();
}

function createColourRows() {
  const rows = [];

  for (let i = 0; i < COLOUR_ROLES.length; i += 4) {
    const row = new ActionRowBuilder();
    const colours = COLOUR_ROLES.slice(i, i + 4);

    for (const colour of colours) {
    row.addComponents(
  new ButtonBuilder()
    .setCustomId(colour.id)
    .setLabel(cleanButtonLabel(colour.name))
    .setStyle(ButtonStyle.Secondary)
);
    }

    rows.push(row);
  }

  return rows;
}

module.exports = {
  name: "setup-colour-roles",

  async execute(interaction) {
    if (
      !interaction.memberPermissions.has(
        PermissionFlagsBits.Administrator
      )
    ) {
      return interaction.reply({
        content: "❌ You need Administrator permission.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: "Setting up the colour role panel...",
      ephemeral: true
    });

    try {
      const channel = interaction.channel;

      const messages = await channel.messages.fetch({
        limit: 100
      });

      const oldPanels = messages.filter(message => {
        const description =
          message.embeds[0]?.description || message.content;

        return (
          message.author.id === interaction.client.user.id &&
          description.includes("**colour roles**")
        );
      });

      for (const oldPanel of oldPanels.values()) {
        await oldPanel.delete().catch(error => {
          console.warn(
            `Could not delete old colour panel ${oldPanel.id}:`,
            error.message
          );
        });
      }

      const bannerPath = path.join(
  __dirname,
  "../assets/colour-banner.png"
);

      const banner = new AttachmentBuilder(bannerPath);

      await channel.send({
        files: [banner]
      });

      const rows = createColourRows();

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.client.user.username,
          iconURL:
            interaction.client.user.displayAvatarURL()
        })
        .setDescription(
          [
            "˖ ࣪ ⊹ **colour roles** ୨୧ ˖",
            "⊹ choose your name colour.",
            "",
            "• you can only have one colour role.",
            "• choosing another colour removes your old one.",
            "• click your current colour again to remove it."
          ].join("\n")
        )
        .setColor("#2B0B3F");

      await channel.send({
        embeds: [embed],
        components: rows
      });

      await interaction.editReply({
        content: `✅ Colour role panel posted in ${channel}.`
      });
    } catch (error) {
      console.error("Colour role setup error:", error);

      await interaction.editReply({
        content: `❌ Colour role setup failed: ${error.message}`
      });
    }
  }
};
