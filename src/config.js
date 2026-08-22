const categories = [
  ["🔥・WELCOME", ["announcements", "rules", "verify", "updates", "about-campfire-cove", "server-boosts", "bump"]],
  ["🪪・YOU", ["self-roles", "colour-roles", "notification-roles"]],
  ["💬・CHATS", ["general", "late-night-chat", "make-friends", "introductions", "selfies", "media", "highlights", "suggestions", "quotes", "starboard", "levels", "leaderboard"]],
  ["🎮・GAMING", ["gaming", "looking-for-group", "game-recommendations", "clips"]],
  ["🎲・FUN", ["memes", "pets", "food", "music", "books", "anime", "birthdays", "question-of-the-day", "song-of-the-day"]],
  ["🎯・ACTIVITIES", ["events", "giveaways", "counting", "confessions", "truth-or-dare"]],
  ["🤖・BOTS", ["bot-commands", "poketwo", "catbot", "dank-memer"]],
  ["🎫・SUPPORT", ["tickets", "help", "bug-reports"]],
  ["🤝・PARTNERSHIPS", ["partners", "partnership-requests"]]
];

const voiceCategory = ["General", "Gaming", "Movies", "Music", "Private Duo", "Private Group", "No Mic"];
const staffChannels = ["staff-chat", "staff-logs", "bot-logs", "reports", "analytics", "applications"];

const staffRoles = [
  ["🔥 Owner", "#E76F51"], ["🪵 Co-Owner", "#F4A261"], ["🏕️ Management", "#9B5DE5"],
  ["🛡️ Admin", "#EF476F"], ["🌙 Senior Moderator", "#7B2CBF"], ["✨ Moderator", "#3A86FF"], ["🌱 Trial Mod", "#2A9D8F"]
];

const baseRoles = [
  ["❤️ Member", "#E76F51"], ["🌟 Server OG", "#FFD166"], ["💎 VIP", "#B5179E"],
  ["🤝 Trusted", "#43AA8B"], ["🏆 Event Winner", "#F9C74F"], ["🎉 Giveaway Winner", "#F9844A"], ["🔇 Muted", "#6B7280"]
];

const colours = [
  ["Crimson", "#E53935"], ["Pink", "#EC4899"], ["Purple", "#9B5DE5"], ["Blue", "#3B82F6"],
  ["Cyan", "#06B6D4"], ["Green", "#22C55E"], ["Yellow", "#FACC15"], ["Orange", "#F97316"],
  ["Brown", "#8B5A2B"], ["White", "#FFFFFF"], ["Grey", "#6B7280"], ["Black", "#1F2937"]
];

const selfRoleGroups = {
  age: ["18", "19-21", "22-25", "26-30", "30+"],
  gender: ["Male", "Female", "Non-binary", "Gender Fluid", "Transgender", "Other"],
  pronouns: ["She/Her", "He/Him", "They/Them", "Any Pronouns"],
  sexuality: ["Straight", "Bisexual", "Gay", "Asexual", "Lesbian", "Demisexual", "Pansexual", "Queer"],
  location: ["United Kingdom", "North America", "South America", "Europe", "Asia", "Africa", "Oceania"],
  relationship: ["Single", "Taken", "Complicated", "Not Looking", "Looking"],
  dms: ["DMs Open", "DMs Closed", "Ask To DM"],
  interests: ["Gamer", "Music Lover", "Movie Lover", "Anime Fan", "Pet Lover", "Tech Enthusiast", "Creative", "Night Owl"],
  games: ["Mobile", "PC", "Xbox", "Switch", "PlayStation", "Roblox", "Valorant", "Minecraft", "Fortnite", "Call of Duty", "GTA", "Overwatch", "Marvel Rivals", "Dead by Daylight", "League of Legends", "VR Chat"]
};

const pingRoles = ["Chat Revive", "VC Revive", "Daily Question", "Announcement Ping", "Bump Reminder", "Giveaway Ping"];
const levelRoles = [["Active • Level 5", "#8ECAE6"], ["Really Active • Level 10", "#219EBC"], ["Addicted • Level 20", "#FFB703"], ["No Life • Level 30", "#FB8500"], ["I Live Here • Level 50", "#E76F51"]];

module.exports = { categories, voiceCategory, staffChannels, staffRoles, baseRoles, colours, selfRoleGroups, pingRoles, levelRoles };
