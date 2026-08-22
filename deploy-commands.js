require("dotenv").config();

const {
  REST,
  Routes,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits
} = require("discord.js");

const commands = [
  
  new SlashCommandBuilder()
  .setName("setup-rules")
  .setDescription("Post the Campfire Cove rules panel.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
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
      option.setName("everyone").setDescription("Give the roles to every non-bot member").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("exportids")
    .setDescription("Export all IDs.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("listroles")
    .setDescription("List every role and its ID.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Quote a previous message into #quotes")
    .addStringOption(option =>
      option.setName("message").setDescription("Paste the message link here").setRequired(true)
    ),

  new ContextMenuCommandBuilder()
    .setName("Quote")
    .setType(ApplicationCommandType.Message),

  new SlashCommandBuilder()
    .setName("setupserverstats")
    .setDescription("Create and update Campfire Cove server statistics channels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("profilebackground")
    .setDescription("Set a custom background for your profile card.")
    .addAttachmentOption(option =>
      option.setName("image").setDescription("The image to use as your profile background").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("profilecolour")
    .setDescription("Customize your Campfire Cove profile card colours.")
    .addStringOption(option =>
      option.setName("primary").setDescription("Primary colour, e.g. #7C3AED").setRequired(false)
    )
    .addStringOption(option =>
      option.setName("secondary").setDescription("Secondary colour, e.g. #15152B").setRequired(false)
    )
    .addStringOption(option =>
      option.setName("text").setDescription("Text colour, e.g. #FFFFFF").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your Campfire Cove profile card.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to view").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Submit a suggestion for Campfire Cove."),

  new SlashCommandBuilder()
    .setName("setuplevelrewards")
    .setDescription("Create Campfire Cove level reward roles.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your Campfire Cove level rank.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to check").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the Campfire Cove XP leaderboard."),

  new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remove a specific warning from a member.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("warning-id").setDescription("The warning ID to remove").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View a member's warnings.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to check").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to warn").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason for the warning").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("setup-self-roles")
    .setDescription("Post the gender, age, location, and interest role panels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to ban").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason for the ban").setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName("delete-days")
        .setDescription("Delete their messages from the last 0-7 days")
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(7)
    ),

  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to kick").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason for the kick").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member.")
    .addUserOption(option =>
      option.setName("user").setDescription("The member to timeout").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("duration").setDescription("Duration: 10s, 5m, 1h, 1d").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason for the timeout").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode for this channel.")
    .addIntegerOption(option =>
      option
        .setName("seconds")
        .setDescription("Slowmode in seconds. Use 0 to disable.")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    ),

  new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock this channel."),

  new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock this channel so members cannot send messages."),

  new SlashCommandBuilder()
    .setName("setup-ticket-panel")
    .setDescription("Post the Campfire Cove ticket panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("install-campfire-cove")
    .setDescription("Install Campfire Cove server setup.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("setup-colour-roles")
    .setDescription("Create colour roles and button menu.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("setup-optional-pings")
    .setDescription("Create optional ping roles and menu.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify yourself."),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Open a support ticket."),

  new SlashCommandBuilder()
    .setName("close-ticket")
    .setDescription("Close this ticket."),

  new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete a number of messages from this channel.")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  new SlashCommandBuilder()
    .setName("post-custom")
    .setDescription("Open a popup form to post a custom announcement.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("post-update")
    .setDescription("Post the default Campfire Cove update.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("revive-chat")
    .setDescription("Ping Chat Revive.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("revive-vc")
    .setDescription("Ping VC Revive.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("daily-question")
    .setDescription("Post a daily question.")
    .addStringOption(option =>
      option.setName("question").setDescription("Question").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Create a simple giveaway.")
    .addStringOption(option =>
      option.setName("prize").setDescription("Prize").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("duration").setDescription("Duration").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
  .setName("timeout-user")
  .setDescription("Timeout a member.")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("User")
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName("minutes")
      .setDescription("Minutes")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("reason")
      .setDescription("Reason")
      .setRequired(false)
  ),

new SlashCommandBuilder()
  .setName("setup-counting")
  .setDescription("Set up the Campfire Cove counting channel.")
  .addChannelOption(option =>
    option
      .setName("channel")
      .setDescription("The channel members will count in")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
  ),

new SlashCommandBuilder()
  .setName("counting-stats")
  .setDescription("View the server counting statistics.")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The member whose counting statistics you want to view")
      .setRequired(false)
  ),

new SlashCommandBuilder()
  .setName("counting-reset")
  .setDescription("Reset the counting number back to zero.")
  .setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
  )
].map(command => command.toJSON());
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Deploying slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log("Slash commands deployed.");
  } catch (error) {
    console.error(error);
  }
})();
