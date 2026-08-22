async function execute(interaction) {
  return interaction.reply({
    content: "✅ Campfire Cove Bot is online and working!",
    ephemeral: true
  });
}

module.exports = {
  execute
};
