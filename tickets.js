const { findRole } = require("./finders");

async function getOrCreateRole(guild, name, color, hoist = false, mentionable = false) {
  const existing = findRole(guild, name);
  if (existing) return existing;

  return guild.roles.create({
    name,
    color,
    hoist,
    mentionable,
    reason: "Campfire Cove Bot role setup"
  });
}

module.exports = { getOrCreateRole };
