const { AttachmentBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");

const {
  createCanvas,
  loadImage,
  GlobalFonts
} = require("@napi-rs/canvas");

const { getRank, getUserPosition, xpNeeded } = require("../features/levels");
const { getProfileSettings } = require("../features/profileSettings");

GlobalFonts.registerFromPath(
  path.join(__dirname, "../assets/fonts/Inter-Bold.ttf"),
  "Inter"
);

const dataDir =
  process.env.RAILWAY_VOLUME_MOUNT_PATH ||
  path.join(__dirname, "../../data");

async function execute(interaction) {
  await interaction.deferReply();

  const target =
    interaction.options.getUser("user") || interaction.user;

  const member =
    interaction.options.getMember("user") || interaction.member;

  const displayName = member.displayName;

  const stats = getRank(interaction.guild.id, target.id);
  const position = getUserPosition(interaction.guild.id, target.id);
  const needed = xpNeeded(stats.level);
  const percent = Math.min(stats.xp / needed, 1);

  const settings = getProfileSettings(interaction.guild.id, target.id);

  const canvas = createCanvas(900, 300);
  const ctx = canvas.getContext("2d");

  let backgroundDrawn = false;

  if (settings.background) {
    try {
      const backgroundPath = path.join(dataDir, settings.background);

      if (fs.existsSync(backgroundPath)) {
        const bg = await loadImage(backgroundPath);
        drawCoverImage(ctx, bg, 0, 0, 900, 300);
        backgroundDrawn = true;
      }
    } catch (err) {
      console.log("Could not load profile background:", err.message);
    }
  }

  if (!backgroundDrawn) {
    const gradient = ctx.createLinearGradient(0, 0, 900, 300);
    gradient.addColorStop(0, settings.secondary_colour);
    gradient.addColorStop(1, settings.primary_colour);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 300);
  }

  // Glass panel
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  roundRect(ctx, 25, 25, 850, 250, 28);
  ctx.fill();

  // Avatar
  const avatar = await loadImage(
    target.displayAvatarURL({
      extension: "png",
      size: 256
    })
  );

  // Avatar glow
ctx.save();

ctx.shadowColor = settings.primary_colour;
ctx.shadowBlur = 35;

ctx.strokeStyle = settings.primary_colour;
ctx.lineWidth = 8;

ctx.beginPath();
ctx.arc(150, 150, 90, 0, Math.PI * 2);
ctx.stroke();

ctx.restore();

// White border
ctx.save();

ctx.strokeStyle = "rgba(255,255,255,0.85)";
ctx.lineWidth = 4;

ctx.beginPath();
ctx.arc(150, 150, 87, 0, Math.PI * 2);
ctx.stroke();

ctx.restore();

// Avatar
ctx.save();
ctx.beginPath();
ctx.arc(150, 150, 85, 0, Math.PI * 2);
ctx.closePath();
ctx.clip();

ctx.drawImage(avatar, 65, 65, 170, 170);

ctx.restore();

  const centerX = 535;

  ctx.textAlign = "center";

  // Nickname
  ctx.fillStyle = settings.text_colour;
  ctx.font = "42px Inter";
  ctx.fillText(displayName, centerX, 85);

  // Username
  ctx.font = "18px Inter";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText(`@${target.username}`, centerX, 110);

  ctx.fillStyle = settings.text_colour;

  // Stats
  ctx.font = "28px Inter";
  ctx.fillText(`Rank #${position || "Unranked"}`, centerX, 155);
ctx.fillText(`Level ${stats.level}`, centerX, 190);

ctx.font = "22px Inter";
ctx.fillText(`Messages: ${stats.messages}`, centerX, 220);

  ctx.font = "24px Inter";
  ctx.fillText(`${stats.xp} / ${needed} XP`, centerX, 250);

  // XP Bar
  const barWidth = 520;
  const barHeight = 24;
  const barX = centerX - barWidth / 2;
  const barY = 265;

  ctx.fillStyle = "rgba(255,255,255,0.25)";
  roundRect(ctx, barX, barY, barWidth, barHeight, 12);
  ctx.fill();

  ctx.fillStyle = settings.text_colour;
  roundRect(ctx, barX, barY, barWidth * percent, barHeight, 12);
  ctx.fill();

  ctx.textAlign = "left";

  const attachment = new AttachmentBuilder(
    canvas.toBuffer("image/png"),
    {
      name: "profile.png"
    }
  );

  return interaction.editReply({
    files: [attachment]
  });
}
function drawCoverImage(ctx, image, x, y, width, height) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.width;
  let sourceHeight = image.height;

  if (imageRatio > canvasRatio) {
    sourceWidth = image.height * canvasRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / canvasRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  );
}
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

module.exports = { execute };
