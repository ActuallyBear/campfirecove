const {
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  name: "post-custom",

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "You need Manage Messages permission to use this command.",
        ephemeral: true
      });
    }

    const modal = new ModalBuilder()
      .setCustomId("campfire_cove_custom_announcement_modal")
      .setTitle("Campfire Cove Announcement");

    const titleInput = new TextInputBuilder()
      .setCustomId("announcement_title")
      .setLabel("Announcement Title")
      .setPlaceholder("Example: Colour Roles Are Live!")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(100);

    const messageInput = new TextInputBuilder()
      .setCustomId("announcement_message")
      .setLabel("Announcement Message")
      .setPlaceholder("Type what you want the bot to say...")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(4000);

    modal.addComponents(
      new ActionRowBuilder().addComponents(titleInput),
      new ActionRowBuilder().addComponents(messageInput)
    );

    return interaction.showModal(modal);
  }
};
