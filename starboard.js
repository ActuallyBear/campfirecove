const { EmbedBuilder } = require("discord.js");

const STAR_EMOJI = "⭐";
const STAR_COUNT = 5;

const postedMessages = new Set();

async function handleStarboard(reaction) {
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  if (reaction.emoji.name !== STAR_EMOJI) return;
  if (reaction.count < STAR_COUNT) return;

  const message = reaction.message;
  if (postedMessages.has(message.id)) return;
  if (message.author.bot) return;

  const starboardChannel = message.guild.channels.cache.find(
    channel => channel.name === "•₊˚๑🫐│starboardˎˊ˗" && channel.isTextBased()
  );

  if (!starboardChannel) return;

  const embed = new EmbedBuilder()
    .setColor("#FFD700")
    .setAuthor({
      name: message.author.username,
      iconURL: message.author.displayAvatarURL()
    })
    .setDescription(message.content || "*No text content*")
    .addFields({
      name: "Original Message",
      value: `[Jump to message](${message.url})`
    })
    .setFooter({
      text: `⭐ ${reaction.count} stars`
    })
    .setTimestamp(message.createdAt);

  const image = message.attachments.find(attachment =>
    attachment.contentType?.startsWith("image/")
  );

  if (image) {
    embed.setImage(image.url);
  }

  await starboardChannel.send({ embeds: [embed] });

  postedMessages.add(message.id);
}

module.exports = { handleStarboard };
