const {
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

const { coveEmbed } = require("../utils/embed");
const { sendLog } = require("../utils/logs");

module.exports = {
  name: "ticket",

  async execute(interaction) {
    const guild = interaction.guild;
    const member = interaction.member;

    const existingTicket = guild.channels.cache.find(
      channel => channel.name === `ticket-${member.user.username.toLowerCase()}`
    );

    if (existingTicket) {
      return interaction.reply({
        content: `You already have an open ticket: ${existingTicket}`,
        ephemeral: true
      });
    }

    const ticketChannel = await guild.channels.create({
      name: `ticket-${member.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: member.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        }
      ]
    });

    await ticketChannel.send({
      content: `${member}`,
      embeds: [
        coveEmbed(
          "🎫 Ticket Opened",
          "Please explain what you need help with. A staff member will reply as soon as possible.",
          "#60A5FA"
        )
      ]
    });

    
    await sendLog(
  guild,
  "🎫 Ticket Opened",
  `${member} opened ${ticketChannel}`,
  "#22C55E"
);

    return interaction.reply({
      content: `Ticket created: ${ticketChannel}`,
      ephemeral: true
    });
  }
};
