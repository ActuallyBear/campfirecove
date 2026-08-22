const {
    ChannelType,
    PermissionsBitField
} = require("discord.js");

const CHANNELS = [
    "👥 Total Members",
    "🧑 Humans",
    "🤖 Bots",
    "💜 Boosts",
    "📅 Created"
];

async function setupServerStats(guild) {

    let category = guild.channels.cache.find(c =>
        c.type === ChannelType.GuildCategory &&
        c.name === "📊 Server Statistics"
    );

    if (!category) {
        category = await guild.channels.create({
            name: "📊 Server Statistics",
            type: ChannelType.GuildCategory
        });
    }

    const everyone = guild.roles.everyone;

    category.permissionOverwrites.set([
        {
            id: everyone.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.Connect]
        }
    ]);

    for (const name of CHANNELS) {

        let channel = guild.channels.cache.find(c =>
            c.parentId === category.id &&
            c.name.startsWith(name)
        );

        if (!channel) {
            await guild.channels.create({
                name: `${name}: ...`,
                type: ChannelType.GuildVoice,
                parent: category.id
            });
        }
    }

    await updateServerStats(guild);
}

async function updateServerStats(guild) {

    const total = guild.memberCount;

    const humans = guild.members.cache.filter(m => !m.user.bot).size;
    const bots = guild.members.cache.filter(m => m.user.bot).size;

    const boosts = guild.premiumSubscriptionCount;

    const created =
        new Date(guild.createdTimestamp).getFullYear();

    const values = {
        "👥 Total Members": total,
        "🧑 Humans": humans,
        "🤖 Bots": bots,
        "💜 Boosts": boosts,
        "📅 Created": created
    };

    for (const channel of guild.channels.cache.values()) {

        if (!channel.parent) continue;
        if (channel.parent.name !== "📊 Server Statistics") continue;

        for (const key in values) {

            if (channel.name.startsWith(key)) {

                await channel.setName(`${key}: ${values[key]}`);

            }

        }

    }

}

module.exports = {
    setupServerStats,
    updateServerStats
};
