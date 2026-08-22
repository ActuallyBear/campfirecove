const { PermissionFlagsBits } = require("discord.js");
const Roles = require("../config/roles");

const staffRoleIds = [
  Roles.STAFF.TRIAL_MOD,
  Roles.STAFF.MODERATOR,
  Roles.STAFF.SENIOR_MODERATOR,
  Roles.STAFF.ADMIN,
  Roles.STAFF.MANAGEMENT,
  Roles.STAFF.CO_OWNER,
  Roles.STAFF.OWNER
];

function hasStaffPermission(interaction) {
  return (
    interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
    interaction.member.roles.cache.some(role => staffRoleIds.includes(role.id))
  );
}

module.exports = {
  staffRoleIds,
  hasStaffPermission
};
