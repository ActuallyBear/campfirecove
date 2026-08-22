const { sendStaffLog } = require("../utils/staffLogs");
const Roles = require("../config/roles");

async function verifyMember(interaction) {
  const roleIdsToAdd = [
    Roles.MISC.MEMBER,
    Roles.SEPARATORS.ABOUT_ME,
    Roles.SEPARATORS.EXTRA_INFO,
    Roles.SEPARATORS.PINGS,
    Roles.SEPARATORS.ADDITIONAL
  ].filter(Boolean);

  const missingRoles = roleIdsToAdd.filter(
    roleId => !interaction.guild.roles.cache.has(roleId)
  );

  if (missingRoles.length > 0) {
    return interaction.reply({
      content: "❌ Some verification roles are missing. Check `roles.js`.",
      ephemeral: true
    });
  }

  const alreadyVerified = interaction.member.roles.cache.has(Roles.MISC.MEMBER);

  if (alreadyVerified) {
    return interaction.reply({
      content: "✅ You're already verified!",
      ephemeral: true
    });
  }

  await interaction.member.roles.add(roleIdsToAdd);

  await sendStaffLog(interaction.guild, {
    title: "✅ Member Verified",
    description: `${interaction.user} has successfully verified.`,
    user: interaction.user,
    extra:
      `📅 **Account Created:** <t:${Math.floor(interaction.user.createdTimestamp / 1000)}:F>\n` +
      `⏳ **Account Age:** <t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>\n` +
      `📥 **Joined Server:** <t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:F>\n` +
      `⏱️ **Time in Server:** <t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:R>`,
    color: "#57F287"
  });

  return interaction.reply({
    content: "🎉 Welcome to Campfire Cove! You have been verified.",
    ephemeral: true
  });
}

module.exports = {
  verifyMember
};
