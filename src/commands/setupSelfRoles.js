const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");

const path = require("path");
const { SELF_ROLES } = require("../config/constants");

function cleanButtonLabel(name) {
  return name
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .toLowerCase();
}

function createRows(group) {
  const roles = SELF_ROLES.filter(
    role => role.group === group
  );

  const rows = [];

  for (let i = 0; i < roles.length; i += 5) {
    const row = new ActionRowBuilder();
    const rowRoles = roles.slice(i, i + 5);

    for (const role of rowRoles) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(cleanButtonLabel(role.name))
          .setStyle(ButtonStyle.Secondary)
      );
    }

    rows.push(row);
  }

  return rows;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-self-roles")
    .setDescription("Post all Campfire Cove self-role panels.")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    await interaction.reply({
      content: "Setting up the self-role panels...",
      ephemeral: true
    });

    try {
      const channel = interaction.channel;

      const messages = await channel.messages.fetch({
        limit: 100
      });

      const oldPanels = messages.filter(message => {
        const description =
          message.embeds[0]?.description || message.content;

        return (
          message.author.id === interaction.client.user.id &&
          (
            description.includes("**age roles**") ||
            description.includes("**gender roles**") ||
            description.includes("**pronoun roles**") ||
            description.includes("**sexuality roles**") ||
            description.includes("**relationship roles**") ||
            description.includes("**region roles**") ||
            description.includes("**dm status**") ||
            description.includes("**interest roles**") ||
            description.includes("**gaming roles**") ||
            description.includes("**role separators**")
          )
        );
      });

      for (const oldPanel of oldPanels.values()) {
        await oldPanel.delete().catch(error => {
          console.warn(
            `Could not delete old self-role panel ${oldPanel.id}:`,
            error.message
          );
        });
      }

      const bannerPath = path.join(
        __dirname,
        "../assets/roles-banner.png"
      );

      const banner = new AttachmentBuilder(bannerPath);

      await channel.send({
        files: [banner]
      });

      const panels = [
        {
          group: "age",
          content:
            "˖ ࣪ ⊹ **age roles** ୨୧ ˖\n" +
            "⊹ choose your age range."
        },
        {
          group: "gender",
          content:
            "˖ ࣪ ⊹ **gender roles** ୨୧ ˖\n" +
            "⊹ choose your gender role."
        },
        {
          group: "pronouns",
          content:
            "˖ ࣪ ⊹ **pronoun roles** ୨୧ ˖\n" +
            "⊹ choose your pronouns."
        },
        {
          group: "sexuality",
          content:
            "˖ ࣪ ⊹ **sexuality roles** ୨୧ ˖\n" +
            "⊹ choose your sexuality role."
        },
        {
          group: "location",
          content:
            "˖ ࣪ ⊹ **region roles** ୨୧ ˖\n" +
            "⊹ choose your location role."
        },
        {
          group: "relationship",
          content:
            "˖ ࣪ ⊹ **relationship roles** ୨୧ ˖\n" +
            "⊹ choose your relationship status."
        },
        {
          group: "dms",
          content:
            "˖ ࣪ ⊹ **dm status** ୨୧ ˖\n" +
            "⊹ let people know if they can dm you."
        },
        {
          group: "interest",
          content:
            "˖ ࣪ ⊹ **interest roles** ୨୧ ˖\n" +
            "⊹ choose any interests that apply to you."
        },
        {
          group: "game",
          content:
            "˖ ࣪ ⊹ **gaming roles** ୨୧ ˖\n" +
            "⊹ choose the games/platforms you play."
        },
        {
          group: "separator",
          content:
            "˖ ࣪ ⊹ **role separators** ୨୧ ˖\n" +
            "⊹ add or remove separator roles from your profile."
        }
      ];

      for (const panel of panels) {
        const rows = createRows(panel.group);

        if (rows.length === 0) {
          continue;
        }

        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.client.user.username,
            iconURL:
              interaction.client.user.displayAvatarURL()
          })
          .setDescription(panel.content)
          .setColor("#2B0B3F");

        await channel.send({
          embeds: [embed],
          components: rows
        });
      }

      await interaction.editReply({
        content: `✅ Self-role panels posted in ${channel}.`
      });
    } catch (error) {
      console.error("Self-role setup error:", error);

      await interaction.editReply({
        content: `❌ Self-role setup failed: ${error.message}`
      });
    }
  }
};
