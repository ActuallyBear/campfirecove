const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giverole")
    .setDescription("Give up to 5 roles to one member or everyone.")
    .addRoleOption(option =>
      option.setName("role1").setDescription("First role").setRequired(true)
    )
    .addRoleOption(option =>
      option.setName("role2").setDescription("Second role").setRequired(false)
    )
    .addRoleOption(option =>
      option.setName("role3").setDescription("Third role").setRequired(false)
    )
    .addRoleOption(option =>
      option.setName("role4").setDescription("Fourth role").setRequired(false)
    )
    .addRoleOption(option =>
      option.setName("role5").setDescription("Fifth role").setRequired(false)
    )
    .addUserOption(option =>
      option.setName("user").setDescription("Member to give the roles to").setRequired(false)
    )
    .addBooleanOption(option =>
      option.setName("everyone").setDescription("Give roles to every non-bot member").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const roles = [
      interaction.options.getRole("role1"),
      interaction.options.getRole("role2"),
      interaction.options.getRole("role3"),
      interaction.options.getRole("role4"),
      interaction.options.getRole("role5")
    ].filter(Boolean);

    const user = interaction.options.getUser("user");
    const everyone = interaction.options.getBoolean("everyone") ?? false;

    if (!user && !everyone) {
      return interaction.reply({
        content: "❌ Choose a user or set **everyone** to true.",
        ephemeral: true
      });
    }

    if (user && everyone) {
      return interaction.reply({
        content: "❌ Choose either a user or everyone, not both.",
        ephemeral: true
      });
    }

    if (user) {
      const member = await interaction.guild.members.fetch(user.id);

      const rolesToAdd = roles.filter(role => !member.roles.cache.has(role.id));

      if (!rolesToAdd.length) {
        return interaction.reply({
          content: `${member} already has all of those roles.`,
          ephemeral: true
        });
      }

      await member.roles.add(rolesToAdd);

      return interaction.reply({
        content: `✅ Gave **${rolesToAdd.length}** role(s) to ${member}.`,
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `⏳ Giving **${roles.length}** role(s) to everyone...`,
      ephemeral: true
    });

    await interaction.guild.members.fetch();

    let success = 0;
    let skipped = 0;
    let failed = 0;

    for (const member of interaction.guild.members.cache.values()) {
      if (member.user.bot) {
        skipped++;
        continue;
      }

      const rolesToAdd = roles.filter(role => !member.roles.cache.has(role.id));

      if (!rolesToAdd.length) {
        skipped++;
        continue;
      }

      try {
        await member.roles.add(rolesToAdd);
        success++;
      } catch {
        failed++;
      }
    }

    await interaction.followUp({
      content:
        `✅ Finished!\n\n` +
        `Members updated: **${success}**\n` +
        `Skipped: **${skipped}**\n` +
        `Failed: **${failed}**`,
      ephemeral: true
    });
  }
};
