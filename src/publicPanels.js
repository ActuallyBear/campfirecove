const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const { channelByName } = require("./install");

const BRAND = "#E76F51";
const DARK = "#2B0B3F";

async function replacePanel(channel, marker, payload) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const previous = messages.filter(message =>
    message.author.id === channel.guild.members.me.id &&
    message.embeds.some(item => item.footer?.text === marker)
  );
  for (const message of previous.values()) await message.delete().catch(() => null);
  await channel.send(payload);
}

function panel(title, description, marker, color = BRAND) {
  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({
      name: "Campfire Cove",
      iconURL: "https://cdn.discordapp.com/embed/avatars/0.png"
    })
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: marker })
    .setTimestamp();
}

async function setupPublicPanels(guild) {
  const about = channelByName(guild, "about-campfire-cove");
  const rules = channelByName(guild, "rules");
  const verify = channelByName(guild, "verify");
  const tickets = channelByName(guild, "tickets");

  if (!about || !rules || !verify || !tickets) {
    throw new Error("Run /install-campfire-cove first so the public channels exist.");
  }

  await replacePanel(about, "campfire-cove:about", {
    embeds: [panel(
      "🔥 Welcome to Campfire Cove",
      [
        "A cosy **18+ social community** built for genuine friendships, late-night conversations and sharing the things you love.",
        "",
        "### Start here",
        "✦ Read <#" + rules.id + ">",
        "✦ Verify in <#" + verify.id + ">",
        "✦ Choose your roles once the community opens",
        "✦ Introduce yourself and join the conversation",
        "",
        "Whether you're here to chat, game, share music or simply find your people—there's a place beside the fire for you."
      ].join("\n"),
      "campfire-cove:about"
    )]
  });

  await replacePanel(rules, "campfire-cove:rules", {
    embeds: [panel(
      "📜 Campfire Cove Rules • 18+",
      [
        "**1. Treat everyone with respect**",
        "Harassment, bullying, discrimination, hate speech and targeted hostility are not welcome.",
        "",
        "**2. Keep the peace**",
        "Do not create or encourage drama. If staff ask you to stop a topic, move on.",
        "",
        "**3. Keep everyone safe**",
        "No threats, scams, predatory behaviour, malicious links or sharing private information.",
        "",
        "**4. No unsolicited advertising**",
        "Do not advertise servers, accounts, products or services without staff approval.",
        "",
        "**5. Use channels appropriately**",
        "Keep content relevant to the channel and avoid spam, flooding and excessive pings.",
        "",
        "**6. Follow Discord's rules**",
        "Discord's Terms of Service and Community Guidelines apply everywhere in the server.",
        "",
        "### Moderation",
        "Two warnings may result in a kick. Repeated disruption can lead to timeouts or removal. Serious violations—including hate speech, threats, scams and predatory behaviour—may result in an immediate ban.",
        "",
        "Use a support ticket to appeal a warning or moderation decision."
      ].join("\n"),
      "campfire-cove:rules",
      DARK
    )]
  });

  await replacePanel(verify, "campfire-cove:verify", {
    embeds: [panel(
      "✨ Ready to join us?",
      "By verifying, you confirm that you are **18 or older** and agree to follow the server rules. Click below to unlock Campfire Cove.",
      "campfire-cove:verify"
    )],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("verify_member")
          .setLabel("Enter Campfire Cove")
          .setEmoji("🔥")
          .setStyle(ButtonStyle.Success)
      )
    ]
  });

  await replacePanel(tickets, "campfire-cove:tickets", {
    embeds: [panel(
      "🎫 Campfire Cove Support",
      [
        "Need help or want to speak privately with the team? Open a ticket below.",
        "",
        "Tickets can be used for:",
        "✦ Member reports and safety concerns",
        "✦ Warning or moderation appeals",
        "✦ Server questions and technical issues",
        "✦ Partnership enquiries",
        "",
        "Please explain what you need clearly and wait patiently for a staff member."
      ].join("\n"),
      "campfire-cove:tickets"
    )],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("open_ticket")
          .setLabel("Open a Ticket")
          .setEmoji("🎫")
          .setStyle(ButtonStyle.Primary)
      )
    ]
  });
}

module.exports = { setupPublicPanels };
