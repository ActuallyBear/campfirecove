const { updateProfileColours } = require("../features/profileSettings");

function isHexColour(value) {
  return /^#[0-9A-F]{6}$/i.test(value);
}

async function execute(interaction) {
  const primary = interaction.options.getString("primary");
  const secondary = interaction.options.getString("secondary");
  const text = interaction.options.getString("text");

  if (!isHexColour(primary) || !isHexColour(secondary) || !isHexColour(text)) {
    return interaction.reply({
      content: "Please use valid hex colours, like `#7C3AED`.",
      ephemeral: true
    });
  }

  updateProfileColours(
    interaction.guild.id,
    interaction.user.id,
    primary,
    secondary,
    text
  );

  return interaction.reply({
    content:
      `✅ Profile colours updated!\n\n` +
      `Primary: \`${primary}\`\n` +
      `Secondary: \`${secondary}\`\n` +
      `Text: \`${text}\``,
    ephemeral: true
  });
}

module.exports = { execute };
