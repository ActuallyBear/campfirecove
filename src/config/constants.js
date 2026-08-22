const Roles = require("./roles");

const COLOUR_ROLES = [
  {
    name: "❤️ Crimson",
    hex: "#E53935",
    id: "colour_crimson",
    roleId: Roles.COLOURS.CRIMSON,
    emoji: "<:crimson:1525127511225401547>"
  },
  {
    name: "🩷 Pink",
    hex: "#EC4899",
    id: "colour_pink",
    roleId: Roles.COLOURS.PINK,
    emoji: "<:pink:1525129003017441370>"
  },
  {
    name: "💜 Purple",
    hex: "#E76F51",
    id: "colour_purple",
    roleId: Roles.COLOURS.PURPLE,
    emoji: "<:purple:1525129060596842516>"
  },
  {
    name: "💙 Blue",
    hex: "#3B82F6",
    id: "colour_blue",
    roleId: Roles.COLOURS.BLUE,
    emoji: "<:purple:1525129106612555906>" // Replace if you have a blue emoji
  },
  {
    name: "🩵 Cyan",
    hex: "#06B6D4",
    id: "colour_cyan",
    roleId: Roles.COLOURS.CYAN,
    emoji: "<:cyan:1525129173360709822>"
  },
  {
    name: "💚 Green",
    hex: "#22C55E",
    id: "colour_green",
    roleId: Roles.COLOURS.GREEN,
    emoji: "<:green:1525129203048120450>"
  },
  {
    name: "💛 Yellow",
    hex: "#FACC15",
    id: "colour_yellow",
    roleId: Roles.COLOURS.YELLOW,
    emoji: "<:yellow:1525129279510417448>"
  },
  {
    name: "🧡 Orange",
    hex: "#F97316",
    id: "colour_orange",
    roleId: Roles.COLOURS.ORANGE,
    emoji: "<:orange:1525129237294743602>"
  },
  {
    name: "🤎 Brown",
    hex: "#8B5A2B",
    id: "colour_brown",
    roleId: Roles.COLOURS.BROWN,
    emoji: "<:brown:1525129318156468364>"
  },
  {
    name: "🤍 White",
    hex: "#FFFFFF",
    id: "colour_white",
    roleId: Roles.COLOURS.WHITE,
    emoji: "<:white:1525129364482556067>"
  },
  {
    name: "🩶 Grey",
    hex: "#6B7280",
    id: "colour_grey",
    roleId: Roles.COLOURS.GREY,
    emoji: "<:grey:1525129409508671500>"
  },
  {
    name: "🖤 Black",
    hex: "#1F2937",
    id: "colour_black",
    roleId: Roles.COLOURS.BLACK,
    emoji: "<:black:1525129442811449394>"
  }
];

const OPTIONAL_PINGS = [
  { name: "💗 Chat Revive", id: "ping_chat_revive", roleId: Roles.PINGS.CHAT_REVIVE },
  { name: "🎙️ VC Revive", id: "ping_vc_revive", roleId: Roles.PINGS.VC_REVIVE },
  { name: "❓ Daily Question", id: "ping_daily_question", roleId: Roles.PINGS.DAILY_QUESTION },
  { name: "📢 Announcement Ping", id: "ping_announcement", roleId: Roles.PINGS.ANNOUNCEMENT },
  { name: "🚀 Bump Reminder", id: "ping_bump_reminder", roleId: Roles.PINGS.BUMP_REMINDER },
  { name: "🎉 Giveaways", id: "ping_giveaway", roleId: Roles.PINGS.GIVEAWAY }
];

const SELF_ROLES = [
  { name: "18+", id: "age_18plus", roleId: Roles.AGE.AGE_18PLUS, group: "age" },
  { name: "19-21", id: "age_19_21", roleId: Roles.AGE.AGE_19_21, group: "age" },
  { name: "22-25", id: "age_22_25", roleId: Roles.AGE.AGE_22_25, group: "age" },
  { name: "26-30", id: "age_26_30", roleId: Roles.AGE.AGE_26_30, group: "age" },
  { name: "30+", id: "age_30plus", roleId: Roles.AGE.AGE_30PLUS, group: "age" },

  { name: "♂️ Male", id: "gender_male", roleId: Roles.GENDER.MALE, group: "gender" },
  { name: "♀️ Female", id: "gender_female", roleId: Roles.GENDER.FEMALE, group: "gender" },
  { name: "⚧ Non-binary", id: "gender_non_binary", roleId: Roles.GENDER.NON_BINARY, group: "gender" },
  { name: "🌊 Gender Fluid", id: "gender_fluid", roleId: Roles.GENDER.GENDER_FLUID, group: "gender" },
  { name: "🏳️‍⚧️ Transgender", id: "gender_transgender", roleId: Roles.GENDER.TRANSGENDER, group: "gender" },
  { name: "⚧ Other", id: "gender_other", roleId: Roles.GENDER.OTHER, group: "gender" },

  { name: "She/Her", id: "pronouns_she_her", roleId: Roles.PRONOUNS.SHE_HER, group: "pronouns" },
  { name: "He/Him", id: "pronouns_he_him", roleId: Roles.PRONOUNS.HE_HIM, group: "pronouns" },
  { name: "They/Them", id: "pronouns_they_them", roleId: Roles.PRONOUNS.THEY_THEM, group: "pronouns" },
  { name: "Any Pronouns", id: "pronouns_any", roleId: Roles.PRONOUNS.ANY, group: "pronouns" },

  { name: "Straight", id: "sexuality_straight", roleId: Roles.SEXUALITY.STRAIGHT, group: "sexuality" },
  { name: "Bisexual", id: "sexuality_bisexual", roleId: Roles.SEXUALITY.BISEXUAL, group: "sexuality" },
  { name: "Gay", id: "sexuality_gay", roleId: Roles.SEXUALITY.GAY, group: "sexuality" },
  { name: "Asexual", id: "sexuality_asexual", roleId: Roles.SEXUALITY.ASEXUAL, group: "sexuality" },
  { name: "Lesbian", id: "sexuality_lesbian", roleId: Roles.SEXUALITY.LESBIAN, group: "sexuality" },
  { name: "Demisexual", id: "sexuality_demisexual", roleId: Roles.SEXUALITY.DEMISEXUAL, group: "sexuality" },
  { name: "Pansexual", id: "sexuality_pansexual", roleId: Roles.SEXUALITY.PANSEXUAL, group: "sexuality" },
  { name: "Queer", id: "sexuality_queer", roleId: Roles.SEXUALITY.QUEER, group: "sexuality" },

  { name: "🇬🇧 United Kingdom", id: "location_uk", roleId: Roles.LOCATION.UK, group: "location" },
  { name: "🌎 North America", id: "location_north_america", roleId: Roles.LOCATION.NORTH_AMERICA, group: "location" },
  { name: "🌎 South America", id: "location_south_america", roleId: Roles.LOCATION.SOUTH_AMERICA, group: "location" },
  { name: "🇪🇺 Europe", id: "location_eu", roleId: Roles.LOCATION.EUROPE, group: "location" },
  { name: "🌏 Asia", id: "location_asia", roleId: Roles.LOCATION.ASIA, group: "location" },
  { name: "🌍 Africa", id: "location_africa", roleId: Roles.LOCATION.AFRICA, group: "location" },
  { name: "🌊 Oceania", id: "location_oceania", roleId: Roles.LOCATION.OCEANIA, group: "location" },

  { name: "Single", id: "relationship_single", roleId: Roles.RELATIONSHIP_STATUS.SINGLE, group: "relationship" },
  { name: "Taken", id: "relationship_taken", roleId: Roles.RELATIONSHIP_STATUS.TAKEN, group: "relationship" },
  { name: "Complicated", id: "relationship_complicated", roleId: Roles.RELATIONSHIP_STATUS.COMPLICATED, group: "relationship" },
  { name: "Not Looking", id: "relationship_not_looking", roleId: Roles.RELATIONSHIP_STATUS.NOT_LOOKING, group: "relationship" },
  { name: "Looking", id: "relationship_looking", roleId: Roles.RELATIONSHIP_STATUS.LOOKING, group: "relationship" },

  { name: "DMs Open", id: "dms_open", roleId: Roles.DMS.DMS_OPEN, group: "dms" },
  { name: "DMs Closed", id: "dms_closed", roleId: Roles.DMS.DMS_CLOSED, group: "dms" },
  { name: "Ask To DM", id: "dms_ask", roleId: Roles.DMS.ASK_TO_DM, group: "dms" },

  { name: "About Me", id: "separator_about_me", roleId: Roles.SEPARATORS.ABOUT_ME, group: "separator" },
  { name: "Extra Info", id: "separator_extra_info", roleId: Roles.SEPARATORS.EXTRA_INFO, group: "separator" },
  { name: "Pings", id: "separator_pings", roleId: Roles.SEPARATORS.PINGS, group: "separator" },
  { name: "Additional", id: "separator_additional", roleId: Roles.SEPARATORS.ADDITIONAL, group: "separator" },

  { name: "🎮 Gamer", id: "interest_gamer", roleId: Roles.INTERESTS.GAMER, group: "interest" },
  { name: "🎵 Music Lover", id: "interest_music", roleId: Roles.INTERESTS.MUSIC, group: "interest" },
  { name: "🎬 Movie Lover", id: "interest_movie", roleId: Roles.INTERESTS.MOVIE, group: "interest" },
  { name: "📺 Anime Fan", id: "interest_anime", roleId: Roles.INTERESTS.ANIME, group: "interest" },
  { name: "🐶 Pet Lover", id: "interest_pet", roleId: Roles.INTERESTS.PET, group: "interest" },
  { name: "💻 Tech Enthusiast", id: "interest_tech", roleId: Roles.INTERESTS.TECH, group: "interest" },
  { name: "🎨 Creative", id: "interest_creative", roleId: Roles.INTERESTS.CREATIVE, group: "interest" },
  { name: "🌙 Night Owl", id: "interest_nightowl", roleId: Roles.INTERESTS.NIGHT_OWL, group: "interest" },

  { name: "Mobile", id: "game_mobile", roleId: Roles.GAMES.MOBILE, group: "game" },
  { name: "PC", id: "game_pc", roleId: Roles.GAMES.PC, group: "game" },
  { name: "Xbox", id: "game_xbox", roleId: Roles.GAMES.XBOX, group: "game" },
  { name: "Switch", id: "game_switch", roleId: Roles.GAMES.SWITCH, group: "game" },
  { name: "PlayStation", id: "game_playstation", roleId: Roles.GAMES.PLAYSTATION, group: "game" },
  { name: "Roblox", id: "game_roblox", roleId: Roles.GAMES.ROBLOX, group: "game" },
  { name: "Valorant", id: "game_valorant", roleId: Roles.GAMES.VALORANT, group: "game" },
  { name: "Minecraft", id: "game_minecraft", roleId: Roles.GAMES.MINECRAFT, group: "game" },
  { name: "Fortnite", id: "game_fortnite", roleId: Roles.GAMES.FORTNITE, group: "game" },
  { name: "Call of Duty", id: "game_call_of_duty", roleId: Roles.GAMES.CALL_OF_DUTY, group: "game" },
  { name: "GTA", id: "game_gta", roleId: Roles.GAMES.GTA, group: "game" },
  { name: "Overwatch", id: "game_overwatch", roleId: Roles.GAMES.OVERWATCH, group: "game" },
  { name: "Marvel Rivals", id: "game_marvel_rivals", roleId: Roles.GAMES.MARVEL_RIVALS, group: "game" },
  { name: "Dead by Daylight", id: "game_dead_by_daylight", roleId: Roles.GAMES.DEAD_BY_DAYLIGHT, group: "game" },
  { name: "League of Legends", id: "game_league_of_legends", roleId: Roles.GAMES.LEAGUE_OF_LEGENDS, group: "game" },
  { name: "VR Chat", id: "game_vr_chat", roleId: Roles.GAMES.VR_CHAT, group: "game" }
];

module.exports = {
  COLOUR_ROLES,
  OPTIONAL_PINGS,
  SELF_ROLES
};
