const { EmbedBuilder } = require("discord.js");

const templates = {
  general: {
    label: "General Announcement",
    emoji: "🔥",
    color: "#E76F51",
    footer: "Campfire Cove • Gather by the fire. Stay for the people."
  },
  update: {
    label: "Server Update",
    emoji: "✨",
    color: "#3B82F6",
    footer: "Campfire Cove • Server Update"
  },
  event: {
    label: "Community Event",
    emoji: "🎯",
    color: "#9B5DE5",
    footer: "Campfire Cove • Community Event"
  },
  giveaway: {
    label: "Giveaway",
    emoji: "🎁",
    color: "#F9C74F",
    footer: "Campfire Cove • Giveaway"
  },
  staff: {
    label: "Staff Announcement",
    emoji: "🛡️",
    color: "#EF476F",
    footer: "Campfire Cove • Staff Team"
  },
  partnership: {
    label: "Partnership Announcement",
    emoji: "🤝",
    color: "#43AA8B",
    footer: "Campfire Cove • Partnership"
  }
};

async function postAnnouncement(interaction) {
  const type = interaction.options.getString("template");
  const template = templates[type];
  const channel = interaction.options.getChannel("channel");
  const title = interaction.options.getString("title");
  const message = interaction.options.getString("message");
  const ping = interaction.options.getRole("ping");
  if (!template) throw new Error("That announcement template does not exist.");
  if (!channel?.isTextBased() || typeof channel.send !== "function") throw new Error("Choose a text channel where the bot can send messages.");

  const embed = new EmbedBuilder()
    .setColor(template.color)
    .setAuthor({ name: "Campfire Cove", iconURL: interaction.guild.iconURL() || undefined })
    .setTitle(`${template.emoji} ${title}`)
    .setDescription(message)
    .setFooter({ text: template.footer })
    .setTimestamp();

  const sent = await channel.send({
    content: ping ? `${ping}` : undefined,
    embeds: [embed],
    allowedMentions: ping ? { roles: [ping.id] } : { parse: [] }
  });
  return { sent, template };
}

module.exports = { postAnnouncement, templates };
