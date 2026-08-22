const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");

GlobalFonts.registerFromPath(
  path.join(__dirname, "../assets/fonts/Inter-Bold.ttf"),
  "Inter"
);
module.exports.executeFromMessage = async function (interaction) {
  await interaction.deferReply({ ephemeral: true });

  const quotedMessage = interaction.targetMessage;

  await interaction.editReply(`Quoted message: ${quotedMessage.content}`);
};
module.exports = {
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const messageLink = interaction.options.getString("message");

    const match = messageLink.match(
      /discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/
    );

    if (!match) {
      return interaction.editReply("Please paste a valid Discord message link.");
    }

    const guildId = match[1];
    const channelId = match[2];
    const messageId = match[3];

    if (guildId !== interaction.guild.id) {
      return interaction.editReply("That message must be from this server.");
    }

    const sourceChannel = await interaction.guild.channels.fetch(channelId);
    if (!sourceChannel || !sourceChannel.isTextBased()) {
      return interaction.editReply("I couldn't find that message channel.");
    }

    const quotedMessage = await sourceChannel.messages.fetch(messageId).catch(() => null);

    if (!quotedMessage) {
      return interaction.editReply("I couldn't find that message.");
    }

    if (!quotedMessage.content) {
      return interaction.editReply("That message has no text to quote.");
    }

    const quotesChannel = interaction.guild.channels.cache.find(
  channel =>
    channel.name === "😭・quotes" &&
    channel.isTextBased()
);

    if (!quotesChannel) {
      return interaction.editReply("I couldn't find a `#quotes` channel.");
    }

    const user = quotedMessage.author;
    const quote = quotedMessage.content;

    const canvas = createCanvas(1000, 600);
    const ctx = canvas.getContext("2d");

    const avatar = await loadImage(
      user.displayAvatarURL({ extension: "png", size: 1024 })
    );

    ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "90px Inter";
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillText("“", 70, 140);

    ctx.font = "46px Inter";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    wrapText(ctx, quote, canvas.width / 2, 260, 800, 60);

    ctx.font = "32px Inter";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillText(`— ${user.username}`, canvas.width / 2, 500);

    const attachment = new AttachmentBuilder(await canvas.encode("png"), {
      name: "quote.png"
    });

    await quotesChannel.send({
      content: `Quoted by ${interaction.user}`,
      files: [attachment]
    });

    await interaction.editReply("Quote posted in #quotes.");
  }
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (const word of words) {
    const testLine = line + word + " ";

    if (ctx.measureText(testLine).width > maxWidth && line !== "") {
      ctx.fillText(line, x, y);
      line = word + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}
