const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");

const path = require("path");

const FLAME = "🔥";
const STAR = "<a:Yumii_008whiterollstar:1525122138779156580>";

function createEmbed(interaction, description) {
  return new EmbedBuilder()
    .setAuthor({
      name: interaction.client.user.username,
      iconURL: interaction.client.user.displayAvatarURL()
    })
    .setDescription(description)
    .setColor("#2B0B3F");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-rules")
    .setDescription("Post the Campfire Cove rules panel.")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    await interaction.reply({
      content: "Setting up the rules panel...",
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
            description.includes("we're an adult server") ||
            description.includes("warnings, timeouts") ||
            description.includes("boost perks")
          )
        );
      });

      for (const oldPanel of oldPanels.values()) {
        await oldPanel.delete().catch(error => {
          console.warn(
            `Could not delete old rules panel ${oldPanel.id}:`,
            error.message
          );
        });
      }

      const bannerPath = path.join(
        __dirname,
        "../assets/rules-banner.png"
      );

      const banner = new AttachmentBuilder(bannerPath);

      await channel.send({
        files: [banner]
      });

      const rulesOne = [
        `${FLAME} **we're an adult server**, aiming to create a safe environment for adults to make genuine friendships and be part of a welcoming community. please make sure to read the rules.`,
        "",
        `${STAR} **1. be respectful to everyone in chat and vc, including staff.**`,
        "๑ if someone asks you to stop talking about a topic, please respect their wishes.",
        "๑ no body shaming, bullying, sexism, homophobia or any other form of discrimination will be tolerated.",
        "",
        `${STAR} **2. no slurs or derogatory remarks.**`,
        "๑ they have been blocked by the bot, so please don't try to bypass them.",
        "๑ bypassing them will result in a warning.",
        "",
        `${STAR} **3. keep profiles appropriate.**`,
        "names, usernames, pronoun names, banners, profile pictures and statuses must not be offensive.",
        "failure to change them when requested may result in removal from the server.",
        "",
        `${STAR} **4. respect people's beliefs and identity.**`,
        "don't make fun of or talk badly about anyone based on their beliefs, race, religion or appearance.",
        "",
        `${STAR} **5. no minors in the server.**`,
        "๑ this is an 18+ server. if you suspect someone is underage, let a staff member know.",
        "",
        `${STAR} **6. harassment and privacy violations are forbidden.**`,
        "harassment, doxxing, blackmailing, stalking or unrequested inappropriate dms will result in a ban.",
        "๑ don't leak or share anyone's personal information or pictures they sent privately.",
        "๑ don't go looking for members' information if they haven't shared it.",
        "๑ unwanted dms include sexual or sensitive images or messages the recipient did not agree to receive. evidence must be provided."
      ].join("\n");

      const rulesTwo = [
        `${STAR} **7. no jokes about disturbing or sensitive subjects.**`,
        "this includes racism, racial stereotypes, rape, suicide, self-harm, paedophilia and similar topics.",
        "",
        `${STAR} **8. avoid politics and controversial topics.**`,
        "๑ this includes killing, hard drugs, suicide, abuse, abortion and rape.",
        "๑ use the mental health channel for venting and add spoilers to triggering words.",
        "",
        `${STAR} **9. no unsafe content.**`,
        "do not post images, links or videos containing nudity, sexual activity, scams or graphic violence.",
        "",
        `${STAR} **10. no drama.**`,
        "keep personal issues private.",
        "๑ if someone blocks or removes you, don't bring it into the server.",
        "๑ staff will only deal with incidents that happen inside campfire cove.",
        "๑ disagreements are normal, but do not become disrespectful or repeatedly restart arguments.",
        "๑ don't share or stream private dms in the server.",
        "",
        `${STAR} **11. no nsfw content.**`,
        "๑ small jokes are fine provided they do not offend others, but explicit content is not allowed.",
        "",
        `${STAR} **12. no server promotions or invites.**`,
        "advertising is only allowed for official partners.",
        "๑ advertising other servers may result in removal from campfire cove."
      ].join("\n");

      const punishments = [
        "˗ˏˋ ꒰ **warnings, timeouts, bans and appeals** ꒱ ˎˊ˗",
        "",
        `${STAR} **strike system**`,
        "๑ two warnings may lead to a kick.",
        "๑ severe behaviour may result in an immediate kick or ban.",
        "",
        `${STAR} **timeouts**`,
        "causing drama or continuing a topic after being asked to stop may result in a timeout.",
        "",
        `${STAR} **kicks**`,
        "members may be kicked for repeated drama, advertising, harassment, causing issues or repeatedly breaking rules.",
        "",
        `${STAR} **automatic bans**`,
        "hate speech or imagery, racist comments, threats, trolling, scamming, predatory behaviour and inappropriate behaviour involving minors may result in an immediate ban.",
        "",
        `${STAR} **appeals**`,
        "๑ warnings: open a ticket.",
        "๑ kicks: open a ticket.",
        "๑ timeouts: contact a staff member.",
        "๑ bans: contact a staff member.",
        "๑ bans for discord tos violations cannot be appealed.",
        "",
        "╭₊˚๑ **boost perks** ₊˚੭",
        `๑ ${STAR} booster icon`,
        `๑ ${STAR} customisable role with your own name, colour and icon`
      ].join("\n");

      await channel.send({
        embeds: [
          createEmbed(interaction, rulesOne),
          createEmbed(interaction, rulesTwo),
          createEmbed(interaction, punishments)
        ]
      });

      await interaction.editReply({
        content: `✅ Rules panel posted in ${channel}.`
      });
    } catch (error) {
      console.error("Rules setup error:", error);

      const details =
        error?.rawError?.errors
          ? JSON.stringify(error.rawError.errors)
          : error.message;

      await interaction.editReply({
        content: `❌ Rules setup failed: ${details}`
      });
    }
  }
};
