require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials
} = require("discord.js");

const Channels = require("./src/config/channels");

const {
  handleCountingMessage
} = require("./src/features/counting");

const setupCountingCommand = require("./src/commands/setupCounting");
const countingStatsCommand = require("./src/commands/countingStats");
const countingResetCommand = require("./src/commands/countingReset");
const exportIdsCommand = require("./src/commands/exportids");
const listRolesCommand = require("./src/commands/listroles");
const giveRoleCommand = require("./src/commands/giverole");
const { setupStaffLogs } = require("./src/events/staffLogs");
const { handleStarboard } = require("./src/features/starboard");
const quoteCommand = require("./src/commands/quote");

const setupServerStatsCommand = require("./src/commands/setupServerStats");
const { updateServerStats } = require("./src/features/serverStats");

const { buildSuggestionStatusModal } = require("./src/modals/suggestionStatus");
const suggestCommand = require("./src/commands/suggest");

const {
  createSuggestion,
  saveSuggestionMessage,
  getSuggestion,
  setVote,
  updateStatus,
  buildSuggestionEmbed,
  buildSuggestionButtons
} = require("./src/features/suggestions");

const profileBackgroundCommand = require("./src/commands/profilebackground");
const profileCommand = require("./src/commands/profile");
const profileColourCommand = require("./src/commands/profilecolour");

const setupLevelRewardsCommand = require("./src/commands/setupLevelRewards");
const rankCommand = require("./src/commands/rank");
const leaderboardCommand = require("./src/commands/leaderboard");
const { handleMessageXP } = require("./src/features/levels");

const removeWarnCommand = require("./src/commands/removewarn");
const warningsCommand = require("./src/commands/warnings");
const warnCommand = require("./src/commands/warn");

const setupSelfRoles = require("./src/commands/setupSelfRoles");
const { toggleSelfRole } = require("./src/buttons/selfRoles");

const banCommand = require("./src/commands/ban");
const kickCommand = require("./src/commands/kick");
const timeoutCommand = require("./src/commands/timeout");
const slowmodeCommand = require("./src/commands/slowmode");
const unlockCommand = require("./src/commands/unlock");
const lockCommand = require("./src/commands/lock");
const purgeCommand = require("./src/commands/purge");

const { verifyMember } = require("./src/buttons/verify");
const { sendWelcome } = require("./src/features/welcome");
const { sendStaffLog } = require("./src/utils/staffLogs");

const setupTicketPanel = require("./src/commands/setupTicketPanel");
const ticketCommand = require("./src/commands/ticket");
const closeTicketCommand = require("./src/commands/closeTicket");

const customAnnouncementModal = require("./src/modals/customAnnouncement");
const { toggleColourRole } = require("./src/buttons/colourRoles");
const { toggleOptionalPing } = require("./src/buttons/optionalPings");

const verifyCommand = require("./src/commands/verify");
const setupColourRoles = require("./src/commands/setupColourRoles");
const setupOptionalPings = require("./src/commands/setupOptionalPings");
const setupRules = require("./src/commands/setupRules");
const postCustom = require("./src/commands/postCustom");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("error", error => {
  console.error("Discord client error:", error);
});

client.on("shardError", error => {
  console.error("Discord shard error:", error);
});

client.on("messageCreate", async message => {
  try {

    const handled = await handleCountingMessage(message);

    if (handled) return;

    await handleMessageXP(message);

  } catch (error) {
    console.error("Message XP error:", error);
  }
});

client.on("messageReactionAdd", async reaction => {
  try {
    await handleStarboard(reaction);
  } catch (error) {
    console.error("Starboard error:", error);
  }
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isMessageContextMenuCommand()) {
      if (interaction.commandName === "Quote") {
        return quoteCommand.executeFromMessage(interaction);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "suggest_modal") {
        const suggestionText =
          interaction.fields.getTextInputValue("suggestion_text");

        const suggestionsChannel =
          interaction.guild.channels.cache.get(
            Channels.COMMUNITY.SUGGESTIONS
          );

        if (!suggestionsChannel) {
          return interaction.reply({
            content:
              "I couldn't find the suggestions channel. Check `channels.js`.",
            ephemeral: true
          });
        }

        const suggestionId = createSuggestion(
          interaction.guild.id,
          interaction.user.id,
          suggestionText
        );

        const suggestion = getSuggestion(suggestionId);

        const sentMessage = await suggestionsChannel.send({
          embeds: [buildSuggestionEmbed(suggestion)],
          components: buildSuggestionButtons(suggestionId)
        });

        saveSuggestionMessage(
          suggestionId,
          sentMessage.id
        );

        return interaction.reply({
          content:
            `✅ Your suggestion has been posted in ${suggestionsChannel}.`,
          ephemeral: true
        });
      }
            if (
        interaction.customId.startsWith(
          "suggest_status_"
        )
      ) {
        const parts = interaction.customId.split("_");
        const action = parts[2];
        const suggestionId = Number(parts[3]);

        const reason =
          interaction.fields.getTextInputValue(
            "suggestion_status_reason"
          );

        const statusMap = {
          accept: "Accepted",
          deny: "Denied",
          review: "Review"
        };

        const status = statusMap[action];

        updateStatus(
          suggestionId,
          status,
          reason
        );

        const suggestion =
          getSuggestion(suggestionId);

        await interaction.message.edit({
          embeds: [buildSuggestionEmbed(suggestion)],
          components:
            buildSuggestionButtons(suggestionId)
        });

        try {
          const user =
            await interaction.client.users.fetch(
              suggestion.user_id
            );

          await user.send(
            `Your suggestion **#${suggestion.id}** has been marked as **${status}**.\n\n` +
            `**Reason:** ${reason}`
          );
        } catch {
          console.log(
            "Could not DM suggestion author."
          );
        }

        return interaction.reply({
          content:
            `✅ Suggestion #${suggestionId} updated to **${status}**.`,
          ephemeral: true
        });
      }

      if (
        interaction.customId ===
        customAnnouncementModal.customId
      ) {
        return customAnnouncementModal.execute(
          interaction
        );
      }
    }

    if (interaction.isButton()) {
      console.log(
        "BUTTON CLICKED:",
        interaction.customId
      );

      if (
        interaction.customId.startsWith(
          "suggest_"
        )
      ) {
        const parts =
          interaction.customId.split("_");

        const action = parts[1];
        const suggestionId = Number(parts[2]);

        if (!suggestionId) {
          return interaction.reply({
            content:
              "Invalid suggestion button.",
            ephemeral: true
          });
        }

        if (
          action === "up" ||
          action === "down"
        ) {
          setVote(
            suggestionId,
            interaction.user.id,
            action
          );

          const suggestion =
            getSuggestion(suggestionId);

          return interaction.update({
            embeds: [
              buildSuggestionEmbed(suggestion)
            ],
            components:
              buildSuggestionButtons(
                suggestionId
              )
          });
        }

        if (
          !interaction.member.permissions.has(
            "ManageMessages"
          )
        ) {
          return interaction.reply({
            content:
              "Only staff can update suggestion status.",
            ephemeral: true
          });
        }

        const statusMap = {
          accept: "Accepted",
          deny: "Denied",
          review: "Review"
        };

        if (statusMap[action]) {
          return interaction.showModal(
            buildSuggestionStatusModal(
              action,
              suggestionId
            )
          );
        }
      }

      if (
        interaction.customId ===
          "verify_member" ||
        interaction.customId ===
          "verify_button" ||
        interaction.customId ===
          "verify" ||
        interaction.customId ===
          "campfire_cove_verify"
      ) {
        return verifyMember(interaction);
      }

      if (
        interaction.customId ===
        "open_ticket"
      ) {
        return ticketCommand.execute(
          interaction
        );
      }

      if (
        interaction.customId.startsWith(
          "colour_"
        )
      ) {
        return toggleColourRole(
          interaction
        );
      }

      if (
        interaction.customId.startsWith(
          "ping_"
        )
      ) {
        return toggleOptionalPing(
          interaction
        );
      }

      if (
        interaction.customId.startsWith(
          "gender_"
        ) ||
        interaction.customId.startsWith(
          "age_"
        ) ||
        interaction.customId.startsWith(
          "pronouns_"
        ) ||
        interaction.customId.startsWith(
          "sexuality_"
        ) ||
        interaction.customId.startsWith(
          "location_"
        ) ||
        interaction.customId.startsWith(
          "relationship_"
        ) ||
        interaction.customId.startsWith(
          "dms_"
        ) ||
        interaction.customId.startsWith(
          "separator_"
        ) ||
        interaction.customId.startsWith(
          "interest_"
        ) ||
        interaction.customId.startsWith(
          "game_"
        )
      ) {
        return toggleSelfRole(interaction);
      }
    }

    if (interaction.isChatInputCommand()) {
      if (
        interaction.commandName ===
        "giverole"
      ) {
        return giveRoleCommand.execute(
          interaction
        );
      }
      if (
  interaction.commandName ===
  "setup-counting"
) {
  return setupCountingCommand.execute(
    interaction
  );
}

if (
  interaction.commandName ===
  "counting-stats"
) {
  return countingStatsCommand.execute(
    interaction
  );
}

if (
  interaction.commandName ===
  "counting-reset"
) {
  return countingResetCommand.execute(
    interaction
  );
}

      if (
        interaction.commandName ===
        "exportids"
      ) {
        return exportIdsCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "listroles"
      ) {
        return listRolesCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "quote"
      ) {
        return quoteCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "setupserverstats"
      ) {
        return setupServerStatsCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "profilebackground"
      ) {
        return profileBackgroundCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "profilecolour"
      ) {
        return profileColourCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "profile"
      ) {
        return profileCommand.execute(
          interaction
        );
      }
            if (
        interaction.commandName ===
        "setuplevelrewards"
      ) {
        return setupLevelRewardsCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "suggest"
      ) {
        return suggestCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "setup-self-roles"
      ) {
        return setupSelfRoles.execute(
          interaction
        );
      }

      if (
        interaction.commandName === "rank"
      ) {
        return rankCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "leaderboard"
      ) {
        return leaderboardCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "removewarn"
      ) {
        return removeWarnCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "warnings"
      ) {
        return warningsCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "warn"
      ) {
        return warnCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "ban"
      ) {
        return banCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "kick"
      ) {
        return kickCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "timeout"
      ) {
        return timeoutCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "slowmode"
      ) {
        return slowmodeCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "unlock"
      ) {
        return unlockCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "lock"
      ) {
        return lockCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "purge"
      ) {
        return purgeCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "setup-colour-roles"
      ) {
        return setupColourRoles.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "setup-optional-pings"
      ) {
        return setupOptionalPings.execute(
          interaction
        );
      }
      if (
  interaction.commandName ===
  "setup-rules"
) {
  return setupRules.execute(
    interaction
  );
}

      if (
        interaction.commandName ===
        "post-custom"
      ) {
        return postCustom.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "verify"
      ) {
        return verifyCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "ticket"
      ) {
        return ticketCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "close-ticket"
      ) {
        return closeTicketCommand.execute(
          interaction
        );
      }

      if (
        interaction.commandName ===
        "setup-ticket-panel"
      ) {
        return setupTicketPanel.execute(
          interaction
        );
      }
        
      }

      return interaction.reply({
        content:
          "This command is installed, but this feature has not been connected yet.",
        ephemeral: true
      });
    
  } catch (error) {
    console.error(error);

    if (
      interaction.replied ||
      interaction.deferred
    ) {
      return interaction.followUp({
        content:
          "Something went wrong. Check the bot logs.",
        ephemeral: true
      });
    }

    return interaction.reply({
      content:
        "Something went wrong. Check the bot logs.",
      ephemeral: true
    });
  }
});

client.on("guildMemberAdd", async member => {
  console.log(
    `✅ JOIN EVENT: ${member.user.tag}`
  );

  await updateServerStats(member.guild);

  await sendStaffLog(member.guild, {
    title: "📥 Member Joined",
    description:
      `${member} joined the server.`,
    user: member.user,
    extra:
      `📅 **Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n` +
      `⏳ **Account Age:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n` +
      `👥 **Member Count:** ${member.guild.memberCount}`,
    color: "#22C55E"
  });

  await sendWelcome(member);
});

client.on("guildMemberRemove", async member => {
  await updateServerStats(member.guild);

  await sendStaffLog(member.guild, {
    title: "📤 Member Left",
    description:
      `${member.user.tag} left the server.`,
    user: member.user,
    extra:
      `📅 **Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n` +
      `⏳ **Account Age:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n` +
      `👥 **Member Count:** ${member.guild.memberCount}`,
    color: "#EF4444"
  });
});

setupStaffLogs(client);
console.log(
  "DISCORD_TOKEN loaded:",
  Boolean(process.env.DISCORD_TOKEN)
);

client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log("✅ Discord login request succeeded.");
  })
  .catch(error => {
    console.error("❌ Discord login failed:", error);
  });
