const { getProfileSettings, updateProfileColours } = require("../features/profileSettings");

function isHex(value) {
  return /^#[0-9A-F]{6}$/i.test(value);
}

async function execute(interaction) {
  const current = getProfileSettings(interaction.guild.id, interaction.user.id);

  const primary = interaction.options.getString("primary") || current.primary_colour;
  const secondary = interaction.options.getString("secondary") || current.secondary_colour;
  const text = interaction.options.getString("text") || current.text_colour;

  if (!isHex(primary) || !isHex(secondary) || !isHex(text)) {
    return interaction.reply({
      content: "Please use valid hex colours like `#7C3AED`.",
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
