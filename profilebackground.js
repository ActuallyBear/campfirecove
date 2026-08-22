const fs = require("fs");
const path = require("path");
const { updateProfileBackground } = require("../features/profileSettings");

const dataDir =
  process.env.RAILWAY_VOLUME_MOUNT_PATH ||
  path.join(__dirname, "../../data");

async function execute(interaction) {
  const image = interaction.options.getAttachment("image");

  if (!image.contentType || !image.contentType.startsWith("image/")) {
    return interaction.reply({
      content: "Please upload a valid image file.",
      ephemeral: true
    });
  }

  const folder = path.join(dataDir, "profile-backgrounds");

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const fileName = `${interaction.guild.id}-${interaction.user.id}.png`;
  const filePath = path.join(folder, fileName);

  const response = await fetch(image.url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  updateProfileBackground(
    interaction.guild.id,
    interaction.user.id,
    `profile-backgrounds/${fileName}`
  );

  return interaction.reply({
    content: "✅ Your profile background has been updated!",
    ephemeral: true
  });
}

module.exports = { execute };
