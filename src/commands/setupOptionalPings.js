const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");

const path = require("path");
const { OPTIONAL_PINGS } = require("../config/constants");

function cleanButtonLabel(name) {
  return name
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .toLowerCase();
}

function createPingRows() {
  const rows = [];

  for (let i = 0; i < OPTIONAL_PINGS.length; i += 5) {
    const row = new ActionRowBuilder();
    const pings = OPTIONAL_PINGS.slice(i, i + 5);

    for (const ping of pings) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(ping.id)
          .setLabel(cleanButtonLabel(ping.name))
          .setStyle(ButtonStyle.Secondary)
      );
    }

    rows.push(row);
  }

  return rows;
}

async function createOptionalPingRoles(guild) {
  for (const ping of OPTIONAL_PINGS) {
    const existingRole = guild.roles.cache.get(ping.roleId);

    if (!existingRole) {
      console.warn(
        `Optional ping role not found: ${ping.name} (${ping.roleId})`
      );
    }
  }
}

module.exports = {
  name: "setup-optional-pings",

  async execute(interaction) {
    if (
      !interaction.memberPermissions.has(
        PermissionFlagsBits.Administrator
      )
    ) {
      return interaction.reply({
        content: "❌ You need Administrator permission.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: "Setting up the optional ping panel...",
      ephemeral: true
    });

    try {
      const channel = interaction.channel;

      await createOptionalPingRoles(interaction.guild);

      const messages = await channel.messages.fetch({
        limit: 100
      });

      const oldPanels = messages.filter(message => {
        const description =
          message.embeds[0]?.description || message.content;

        return (
          message.author.id === interaction.client.user.id &&
          (
            description.includes("**optional pings**") ||
            description.includes("Optional Pings")
          )
        );
      });

      for (const oldPanel of oldPanels.values()) {
        await oldPanel.delete().catch(error => {
          console.warn(
            `Could not delete old optional ping panel ${oldPanel.id}:`,
            error.message
          );
        });
      }

      const bannerPath = path.join(
        __dirname,
        "../assets/optional-banner.png"
      );

      const banner = new AttachmentBuilder(bannerPath);

      await channel.send({
        files: [banner]
      });

      const rows = createPingRows();

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.client.user.username,
          iconURL:
            interaction.client.user.displayAvatarURL()
        })
        .setDescription(
          [
            "˖ ࣪ ⊹ **optional pings** ୨୧ ˖",
            "⊹ choose which notifications you'd like to receive.",
            "",
            "**chat revive**",
            "be notified when we're trying to get chat active again.",
            "",
            "**vc revive**",
            "get pinged whenever people are looking to start a voice chat.",
            "",
            "**daily question**",
            "receive a daily conversation starter.",
            "",
            "**announcement ping**",
            "be notified when important announcements are posted.",
            "",
            "**bump reminder**",
            "get reminded when it's time to bump the server.",
            "",
            "**giveaways**",
            "be notified whenever a giveaway is posted.",
            "",
            "⊹ click a button again to remove the role."
          ].join("\n")
        )
        .setColor("#2B0B3F");

      await channel.send({
        embeds: [embed],
        components: rows
      });

      await interaction.editReply({
        content: `✅ Optional ping panel posted in ${channel}.`
      });
    } catch (error) {
      console.error("Optional ping setup error:", error);

      await interaction.editReply({
        content:
          `❌ Optional ping setup failed: ${error.message}`
      });
    }
  }
};
