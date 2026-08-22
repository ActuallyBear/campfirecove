function findChannel(guild, name) {
  return guild.channels.cache.find(
    channel =>
      channel.name === name ||
      channel.name === name.toLowerCase()
  );
}

function findRole(guild, name) {
  return guild.roles.cache.find(
    role => role.name === name
  );
}

module.exports = {
  findChannel,
  findRole
};
