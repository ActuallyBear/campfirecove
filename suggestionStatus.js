const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

function buildSuggestionStatusModal(action, suggestionId) {
  const titles = {
    accept: "✅ Accept Suggestion",
    review: "💬 Review Suggestion",
    deny: "❌ Deny Suggestion"
  };

  const modal = new ModalBuilder()
    .setCustomId(`suggest_status_${action}_${suggestionId}`)
    .setTitle(titles[action] || "Update Suggestion");

  const reasonInput = new TextInputBuilder()
    .setCustomId("suggestion_status_reason")
    .setLabel("Reason")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Type the reason for this decision...")
    .setRequired(true)
    .setMaxLength(1000);

  modal.addComponents(
    new ActionRowBuilder().addComponents(reasonInput)
  );

  return modal;
}

module.exports = { buildSuggestionStatusModal };
