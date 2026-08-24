const { ChannelType } = require("discord.js");

const topics = {
  announcements: "Official Campfire Cove news and important community announcements.",
  rules: "Read the Campfire Cove community rules before joining the conversation.",
  verify: "Verify here to unlock the rest of Campfire Cove.",
  updates: "Keep up with server changes, improvements and new features.",
  "about-campfire-cove": "Learn what Campfire Cove is about and how our community works.",
  "server-boosts": "Celebrating the lovely people who boost and support Campfire Cove.",
  bump: "Help new people find our campfire by bumping the server here.",
  "self-roles": "Choose the roles that tell the community a little about you.",
  "colour-roles": "Choose a colour for your name around the server.",
  "notification-roles": "Choose which Campfire Cove notifications you would like to receive.",
  general: "Our main fireside chat — settle in, say hello and join the conversation.",
  "late-night-chat": "A cosy corner for the night owls and after-hours conversations.",
  "make-friends": "Meet new people, find common interests and make genuine connections.",
  introductions: "Introduce yourself to the Cove and give everyone a warm first hello.",
  selfies: "Share your selfies and spread kind, supportive energy.",
  media: "Share photos, videos and other media with the community.",
  highlights: "Share your favourite moments, achievements and community highlights.",
  suggestions: "Share ideas that could make Campfire Cove even better.",
  quotes: "Memorable, funny and wholesome quotes from around the server.",
  starboard: "The community's most-loved messages, collected under the stars.",
  levels: "Learn how activity levels and level rewards work in Campfire Cove.",
  leaderboard: "See who has been keeping the campfire conversation glowing.",
  gaming: "Chat about games, platforms, updates and whatever you are playing.",
  "looking-for-group": "Find friendly people to team up and play with.",
  "game-recommendations": "Recommend great games or find your next favourite.",
  clips: "Share your best, funniest and most chaotic gaming clips.",
  memes: "Share memes and give the Cove a good laugh.",
  pets: "Photos, stories and appreciation for every kind of animal companion.",
  food: "Share meals, recipes, snacks and delicious discoveries.",
  music: "Talk artists, albums, playlists and everything you have on repeat.",
  books: "Share current reads, recommendations and bookish conversation.",
  anime: "Chat about anime, manga, favourites and recommendations.",
  birthdays: "Celebrate birthdays and make every member feel special.",
  "question-of-the-day": "Answer the daily question and discover more about each other.",
  "song-of-the-day": "Share, discover and discuss the community's daily song pick.",
  events: "Community event news, schedules, sign-ups and conversation.",
  giveaways: "Enter Campfire Cove giveaways and check the latest winners.",
  counting: "Count together one number at a time — no consecutive turns.",
  confessions: "A respectful space for anonymous community confessions.",
  "truth-or-dare": "Join friendly truth-or-dare games and always respect boundaries.",
  "bot-commands": "Use Campfire Cove and utility bot commands here.",
  poketwo: "Catch, collect and battle Pokémon with Pokétwo.",
  catbot: "Use Cat Bot commands and enjoy some feline fun.",
  "dank-memer": "Use Dank Memer commands without cluttering the main chats.",
  tickets: "Open a private ticket when you need help from the staff team.",
  help: "Ask community questions and get a helping hand.",
  "bug-reports": "Report bot or server issues clearly so the team can investigate.",
  partners: "Discover the communities partnered with Campfire Cove.",
  "partnership-requests": "Read the requirements and apply to partner with Campfire Cove.",
  "staff-chat": "Private staff conversation and team coordination.",
  "staff-logs": "Staff actions and moderation records for team reference.",
  "bot-logs": "Automated bot events, errors and system activity.",
  reports: "Review member reports and coordinate appropriate action.",
  analytics: "Server activity, growth and community health insights.",
  applications: "Review staff and community team applications."
};

async function applyChannelTopics(guild) {
  let updated = 0;
  let unchanged = 0;
  const missing = [];

  for (const [name, topic] of Object.entries(topics)) {
    const channel = guild.channels.cache.find(candidate =>
      candidate.name.toLowerCase() === name && candidate.type === ChannelType.GuildText
    );
    if (!channel) {
      missing.push(name);
      continue;
    }
    if (channel.topic === topic) {
      unchanged++;
      continue;
    }
    await channel.setTopic(topic, "Campfire Cove channel topic setup");
    updated++;
  }

  return { updated, unchanged, missing };
}

module.exports = { applyChannelTopics, topics };
