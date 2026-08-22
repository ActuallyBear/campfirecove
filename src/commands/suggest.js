const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

async function execute(interaction) {
  const modal = new ModalBuilder()
    .setCustomId("suggest_modal")
    .setTitle("💡 Submit a Suggestion");

  const suggestionInput = new TextInputBuilder()
    .setCustomId("suggestion_text")
    .setLabel("What is your suggestion?")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Type your suggestion here...")
    .setRequired(true)
    .setMaxLength(1000);

  const row = new ActionRowBuilder().addComponents(suggestionInput);

  modal.addComponents(row);

  return interaction.showModal(modal);
}

module.exports = { execute };
