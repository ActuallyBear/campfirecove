const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");
const { channelByName } = require("./install");

const BRAND = "#E76F51";
const STAFF_NAMES = ["🔥 Owner", "🪵 Co-Owner", "🏕️ Management", "🛡️ Admin", "🌙 Senior Moderator", "✨ Moderator", "🌱 Trial Mod"];

const forms = {
  staff: {
    title: "Campfire Cove Staff Application",
    questions: [
      ["age_timezone", "Age and timezone", "Tell us your age and timezone.", TextInputStyle.Short],
      ["experience", "Previous experience", "Tell us about any moderation or community experience.", TextInputStyle.Paragraph],
      ["motivation", "Why do you want to join?", "Why would you like to help the Campfire Cove team?", TextInputStyle.Paragraph],
      ["availability", "Availability", "When and how often are you usually available?", TextInputStyle.Paragraph],
      ["scenario", "Handling conflict", "How would you handle two members arguing after being asked to stop?", TextInputStyle.Paragraph]
    ]
  },
  partnership: {
    title: "Campfire Cove Partnership Request",
    questions: [
      ["server", "Server name and invite", "Give us the server name and a permanent invite link.", TextInputStyle.Short],
      ["members", "Member count", "How many members does your server currently have?", TextInputStyle.Short],
      ["community", "About your community", "Describe your server, its audience and what makes it welcoming.", TextInputStyle.Paragraph],
      ["offer", "Partnership plan", "What would you like this partnership to involve?", TextInputStyle.Paragraph],
      ["representative", "Your role", "What is your role in the server and who should we contact?", TextInputStyle.Paragraph]
    ]
  }
};

function panel(title, description, marker) {
  return new EmbedBuilder()
    .setColor(BRAND)
    .setAuthor({ name: "Campfire Cove" })
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: marker });
}

async function replacePanel(channel, marker, payload) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const old = messages.filter(message =>
    message.author.id === channel.guild.members.me.id &&
    message.embeds.some(embed => embed.footer?.text === marker)
  );
  for (const message of old.values()) await message.delete().catch(() => null);
  await channel.send(payload);
}

async function setupApplicationPanels(guild) {
  const support = guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === "🎫・SUPPORT");
  const partnership = channelByName(guild, "partnership-requests");
  if (!support || !partnership) throw new Error("Run /install-campfire-cove first.");

  let staffChannel = channelByName(guild, "staff-applications");
  let created = false;
  if (!staffChannel) {
    const member = guild.roles.cache.find(role => role.name === "❤️ Member");
    staffChannel = await guild.channels.create({
      name: "staff-applications",
      type: ChannelType.GuildText,
      parent: support.id,
      topic: "Apply to help keep Campfire Cove safe, friendly and welcoming.",
      permissionOverwrites: [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        ...(member ? [{ id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory], deny: [PermissionFlagsBits.SendMessages] }] : [])
      ],
      reason: "Campfire Cove staff applications"
    });
    created = true;
  }

  await replacePanel(staffChannel, "campfire-cove:staff-applications", {
    embeds: [panel(
      "🔥 Join the Campfire Cove Team",
      "Want to help keep our community warm, welcoming and safe? Apply below.\n\nYou must be **18+**, active, patient and able to handle situations calmly. Thoughtful answers give us the best chance to understand you. Please do not chase staff for a decision.",
      "campfire-cove:staff-applications"
    )],
    components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("application:start:staff").setLabel("Apply for Staff").setStyle(ButtonStyle.Primary)
    )]
  });

  await replacePanel(partnership, "campfire-cove:partnership-applications", {
    embeds: [panel(
      "🤝 Partner with Campfire Cove",
      "Represent a friendly **18+ community** and want to grow together? Submit a partnership request below.\n\nYour server should be active, safe, clearly moderated and able to offer a genuine two-way partnership. A permanent invite link is required.",
      "campfire-cove:partnership-applications"
    )],
    components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("application:start:partnership").setLabel("Request a Partnership").setStyle(ButtonStyle.Success)
    )]
  });

  return { created };
}

async function showApplicationModal(interaction) {
  const type = interaction.customId.split(":")[2];
  const form = forms[type];
  if (!form) return;
  const existing = interaction.guild.channels.cache.find(channel => channel.topic?.startsWith(`application:${type}:${interaction.user.id}:pending`));
  if (existing) return interaction.reply({ content: `You already have an open application: ${existing}`, ephemeral: true });

  const modal = new ModalBuilder().setCustomId(`application:submit:${type}`).setTitle(form.title);
  modal.addComponents(...form.questions.map(([id, label, placeholder, style]) =>
    new ActionRowBuilder().addComponents(
      new TextInputBuilder().setCustomId(id).setLabel(label).setPlaceholder(placeholder).setStyle(style).setRequired(true).setMaxLength(style === TextInputStyle.Short ? 200 : 1000)
    )
  ));
  return interaction.showModal(modal);
}

async function submitApplication(interaction) {
  const type = interaction.customId.split(":")[2];
  const form = forms[type];
  if (!form) return;
  await interaction.deferReply({ ephemeral: true });

  const existing = interaction.guild.channels.cache.find(channel => channel.topic?.startsWith(`application:${type}:${interaction.user.id}:pending`));
  if (existing) return interaction.editReply(`You already have an open application: ${existing}`);

  const category = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === "🛡️・STAFF");
  const staff = interaction.guild.roles.cache.filter(role => STAFF_NAMES.includes(role.name));
  const safeName = interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 45) || interaction.user.id;
  const channel = await interaction.guild.channels.create({
    name: `${type}-${safeName}`,
    type: ChannelType.GuildText,
    parent: category?.id,
    topic: `application:${type}:${interaction.user.id}:pending`,
    permissionOverwrites: [
      { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      ...staff.map(role => ({ id: role.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }))
    ],
    reason: `Campfire Cove ${type} application`
  });

  const answers = form.questions.map(([id, label]) => ({
    name: label,
    value: interaction.fields.getTextInputValue(id)
  }));
  await channel.send({
    content: `${interaction.user}`,
    embeds: [new EmbedBuilder().setColor(BRAND).setTitle(form.title).addFields(
      ...answers,
      { name: "Applicant", value: `${interaction.user} (${interaction.user.id})` },
      { name: "Status", value: "⏳ Pending" }
    ).setTimestamp()],
    components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`application:decision:accept:${interaction.user.id}`).setLabel("Accept").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`application:decision:decline:${interaction.user.id}`).setLabel("Decline").setStyle(ButtonStyle.Danger)
    )]
  });
  return interaction.editReply(`✅ Your application has been submitted in ${channel}. You can add anything else there while staff review it.`);
}

async function decideApplication(interaction, isStaff) {
  if (!isStaff(interaction.member)) return interaction.reply({ content: "You don't have staff permission.", ephemeral: true });
  const [, , decision, userId] = interaction.customId.split(":");
  if (!interaction.channel.topic?.startsWith("application:")) return interaction.reply({ content: "This is not an application channel.", ephemeral: true });
  const status = decision === "accept" ? "Accepted" : "Declined";
  const color = decision === "accept" ? "#22C55E" : "#EF4444";
  await interaction.channel.setTopic(interaction.channel.topic.replace(/:pending$/, `:${decision}`));

  const embed = EmbedBuilder.from(interaction.message.embeds[0]);
  embed.setColor(color);
  const fields = embed.data.fields || [];
  const statusIndex = fields.findIndex(field => field.name === "Status");
  if (statusIndex >= 0) fields[statusIndex].value = `${decision === "accept" ? "✅" : "❌"} ${status} by ${interaction.user}`;
  embed.setFields(fields);
  const disabled = interaction.message.components.map(row =>
    new ActionRowBuilder().addComponents(...row.components.map(component => ButtonBuilder.from(component).setDisabled(true)))
  );
  await interaction.update({ embeds: [embed], components: disabled });
  await interaction.channel.send(`<@${userId}>, your application has been **${status.toLowerCase()}** by ${interaction.user}. ${decision === "accept" ? "A staff member will explain the next steps here." : "Thank you for taking the time to apply."}`);
  const user = await interaction.client.users.fetch(userId).catch(() => null);
  await user?.send(`Your Campfire Cove ${interaction.channel.name.startsWith("staff-") ? "staff" : "partnership"} application was **${status.toLowerCase()}**.`).catch(() => null);
}

module.exports = { setupApplicationPanels, showApplicationModal, submitApplication, decideApplication };
