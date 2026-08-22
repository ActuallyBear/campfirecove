const { coveEmbed } = require("../utils/embed");
const Channels = require("../config/channels");

async function sendWelcome(member) {
  const channel = member.guild.channels.cache.get(
    Channels.COMMUNITY.GENERAL
  );

  if (!channel) {
    console.log("❌ Welcome channel not found.");
    return;
  }

  await channel.send({
    content: `${member}`,
    embeds: [
      coveEmbed(
        "🔥 Welcome to Campfire Cove | 18+",
        [
          `Welcome ${member}! <a:002_heart:1525205472779571300>`,
          "",
          "We're so happy you've joined **Campfire Cove**.",
          "",
          "**╭₊˚๑ before you start chatting : ₊˚੭**",
          "make sure you do the following...",
          "",
          "˖ ࣪ ⊹ read the rules in <#1521148685394772099>",
          "˖ ࣪ ⊹ check out <#1521148695146397867>",
          "˖ ࣪ ⊹ introduce yourself and have fun",
          "",
          `You are member **#${member.guild.memberCount}**.`,
          "",
          "We hope you enjoy your stay! 🧡"
        ].join("\n"),
        "#2B0B3F"
      )
    ]
  });
}

module.exports = {
  sendWelcome
};
