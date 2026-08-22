const STAFF_ROLES = [
  "🎫 Trial Moderator",
  "🛠️ Moderator",
  "⚔️ Senior Moderator",
  "🛡️ Administrator",
  "👑 Management",
  "💎 Co-Owner",
  "❤️ Owner"
];

const BASE_ROLES = [
  ["❤️ Owner", "#ff3b5c", true],
  ["💎 Co-Owner", "#ff7eb9", true],
  ["👑 Management", "#b45cff", true],
  ["🛡️ Administrator", "#4d8dff", true],
  ["⚔️ Senior Moderator", "#42d392", true],
  ["🛠️ Moderator", "#6ee7b7", true],
  ["🎫 Trial Moderator", "#facc15", true],
  ["🤖 Bots", "#99a1af", true],

  ["🌸 OG", "#ff9acb", false],
  ["✨ Server Booster", "#f47fff", false],
  ["⭐ VIP", "#ffd166", false],
  ["💖 Trusted", "#ff6bcb", false],

  ["🎮 Gamer", "#5865f2", false],
  ["🎵 Music Lover", "#c084fc", false],
  ["🎬 Movie Lover", "#fb7185", false],
  ["📺 Anime Fan", "#f472b6", false],
  ["🐶 Pet Lover", "#f59e0b", false],
  ["💻 Tech Enthusiast", "#38bdf8", false],
  ["🎨 Creative", "#2dd4bf", false],
  ["🌙 Night Owl", "#818cf8", false],

  ["🇬🇧 United Kingdom", "#60a5fa", false],
  ["🇺🇸 United States", "#ef4444", false],
  ["🇪🇺 Europe", "#2563eb", false],
  ["🌍 Other Location", "#22c55e", false],

  ["18+", "#94a3b8", false],
  ["19-21", "#94a3b8", false],
  ["22-25", "#94a3b8", false],
  ["26-30", "#94a3b8", false],
  ["30+", "#94a3b8", false],

  ["♂️ Male", "#38bdf8", false],
  ["♀️ Female", "#fb7185", false],
  ["⚧️ Other", "#c084fc", false],

  ["✅ Verified", "#22c55e", false],
  ["❤️ Member", "#ff6bcb", false],
  ["🔇 Muted", "#64748b", false]
];

const COLOUR_ROLES = [
  { name: "❤️ Crimson", hex: "#E53935", id: "colour_crimson" },
  { name: "🩷 Pink", hex: "#EC4899", id: "colour_pink" },
  { name: "💜 Purple", hex: "#8B5CF6", id: "colour_purple" },
  { name: "💙 Blue", hex: "#3B82F6", id: "colour_blue" },
  { name: "🩵 Cyan", hex: "#06B6D4", id: "colour_cyan" },
  { name: "💚 Green", hex: "#22C55E", id: "colour_green" },
  { name: "💛 Yellow", hex: "#FACC15", id: "colour_yellow" },
  { name: "🧡 Orange", hex: "#F97316", id: "colour_orange" },
  { name: "🤎 Brown", hex: "#8B5A2B", id: "colour_brown" },
  { name: "🤍 White", hex: "#FFFFFF", id: "colour_white" },
  { name: "🩶 Grey", hex: "#6B7280", id: "colour_grey" },
  { name: "🖤 Black", hex: "#1F2937", id: "colour_black" }
];

const OPTIONAL_PINGS = [
  { name: "💗 Chat Revive", id: "ping_chat_revive" },
  { name: "🎙️ VC Revive", id: "ping_vc_revive" },
  { name: "❓ Daily Question", id: "ping_daily_question" }
];

const CHANNEL_LAYOUT = [
  ["╭─── ✦ WELCOME ✦ ───╮", "public", [
    ["📢・announcements", "locked"],
    ["📜・rules", "locked"],
    ["✨・server-guide", "locked"],
    ["🎉・events", "locked"],
    ["📈・updates", "locked"],
    ["🔥・about-campfire-cove", "locked"]
  ]],
  ["╭─── ✦ START HERE ✦ ───╮", "public", [
    ["✅・verify", "public"],
    ["🎂・age-roles", "public"],
    ["🚻・gender-roles", "public"],
    ["🌍・location-roles", "public"],
    ["🎮・interest-roles", "public"],
    ["🎨・colour-roles", "public"],
    ["🔔・notification-roles", "public"],
    ["🙋・introductions", "verified"]
  ]],
  ["╭─── ✦ COMMUNITY ✦ ───╮", "verified", [
    ["💬・general", "verified"],
    ["🌙・late-night-chat", "verified"],
    ["🤝・make-friends", "verified"],
    ["❓・question-of-the-day", "verified"],
    ["😂・memes", "verified"],
    ["📸・selfies", "verified"],
    ["🐶・pets", "verified"],
    ["🍕・food", "verified"],
    ["🎵・music", "verified"],
    ["🎬・movies-tv", "verified"],
    ["📺・anime", "verified"],
    ["📚・books", "verified"],
    ["🎂・birthdays", "verified"]
  ]],
  ["╭─── ✦ GAMING ✦ ───╮", "verified", [
    ["🎮・gaming-chat", "verified"],
    ["🕹️・looking-for-group", "verified"],
    ["⛏️・minecraft", "verified"],
    ["🔫・fps-games", "verified"],
    ["🚗・racing-games", "verified"],
    ["🎲・party-games", "verified"],
    ["📱・mobile-games", "verified"],
    ["🎥・stream-clips", "verified"]
  ]],
  ["╭─── ✦ EVENTS ✦ ───╮", "verified", [
    ["🎉・giveaways", "locked"],
    ["🏆・competitions", "verified"],
    ["🎲・game-nights", "verified"],
    ["🎬・movie-nights", "verified"],
    ["🎵・music-events", "verified"],
    ["📅・event-schedule", "locked"]
  ]],
  ["╭─── ✦ SUPPORT ✦ ───╮", "verified", [
    ["🎫・create-ticket", "locked"],
    ["❓・help", "verified"],
    ["💡・suggestions", "verified"],
    ["🐛・bug-reports", "verified"]
  ]],
  ["╭─── ✦ STAFF ✦ ───╮", "staff", [
    ["📋・staff-chat", "staff"],
    ["📊・staff-logs", "staff"],
    ["🚨・reports", "staff"],
    ["⚙️・bot-logs", "staff"]
  ]],
  ["╭─── ✦ VOICE ✦ ───╮", "verified", [
    ["🔊 General VC", "voice"],
    ["🎮 Gaming VC", "voice"],
    ["💕 Chill VC", "voice"],
    ["🌙 Late Night VC", "voice"],
    ["🎵 Music VC", "voice"],
    ["🎬 Movie Night", "voice"]
  ]]
];

module.exports = {
  STAFF_ROLES,
  BASE_ROLES,
  COLOUR_ROLES,
  OPTIONAL_PINGS,
  CHANNEL_LAYOUT
};
