const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exportids")
    .setDescription("Export all channel, category and role IDs."),

  async execute(interaction) {
    const guild = interaction.guild;

    const categories = guild.channels.cache
      .filter(c => c.type === 4)
      .sort((a, b) => b.position - a.position);

    const channels = guild.channels.cache
      .filter(c => c.type !== 4)
      .sort((a, b) => a.rawPosition - b.rawPosition);

    const roles = guild.roles.cache
      .sort((a, b) => b.position - a.position);

    const output = [];

    output.push("===== CATEGORIES =====\n");

    categories.forEach(category => {
      output.push(`${category.name} = ${category.id}`);
    });

    output.push("\n===== CHANNELS =====\n");

    channels.forEach(channel => {
      output.push(`${channel.name} = ${channel.id}`);
    });

    output.push("\n===== ROLES =====\n");

    roles.forEach(role => {
      output.push(`${role.name} = ${role.id}`);
    });

    const text = output.join("\n");

    const chunks = [];

    for (let i = 0; i < text.length; i += 1900) {
      chunks.push(text.slice(i, i + 1900));
    }

    await interaction.reply({
      content: `\`\`\`\n${chunks[0]}\n\`\`\``,
      ephemeral: true
    });

    for (let i = 1; i < chunks.length; i++) {
      await interaction.followUp({
        content: `\`\`\`\n${chunks[i]}\n\`\`\``,
        ephemeral: true
      });
    }
  }
};
