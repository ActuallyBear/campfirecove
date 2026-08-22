module.exports = {
  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => `${role.name} = ${role.id}`);

    const chunks = [];
    let current = "";

    for (const line of roles) {
      if ((current + line + "\n").length > 1900) {
        chunks.push(current);
        current = "";
      }

      current += line + "\n";
    }

    if (current) chunks.push(current);

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
