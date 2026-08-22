require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { findRole } = require("./utils/finders");

const { installCampfireCove } = require("./features/setup");
const {
  setupColourRoles,
  setupOptionalPings,
  toggleColourRole,
  toggleOptionalPing
} = require("./features/roleMenus");
const { openTicket } = require("./features/tickets");
const {
  showCustomAnnouncementModal,
  handleAnnouncementModal,
  postDefaultUpdate,
  postReviveChat,
  postReviveVc,
  postDailyQuestion
} = require("./features/announcements");
const { timeoutUser } = require("./features/moderation");
const { createGiveaway } = require("./features/giveaways");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === "verify_member") {
        const verifiedRole = findRole(interaction.guild, "✅ Verified");
        const memberRole = findRole(interaction.guild, "❤️ Member");

        if (verifiedRole) await interaction.member.roles.add(verifiedRole);
        if (memberRole) await interaction.member.roles.add(memberRole);

        return interaction.reply({
          content: "You are now verified. Welcome to Campfire Cove ❤️",
          ephemeral: true
        });
      }

      if (interaction.customId === "open_ticket") {
        return openTicket(interaction);
      }

      if (interaction.customId.startsWith("colour_")) {
        return toggleColourRole(interaction);
      }

      if (interaction.customId.startsWith("ping_")) {
        return toggleOptionalPing(interaction);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "campfire_cove_custom_announcement_modal") {
        return handleAnnouncementModal(interaction);
      }
    }

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "install-campfire-cove") {
      await interaction.reply({ content: "Installing Campfire Cove...", ephemeral: true });
      await installCampfireCove(interaction.guild);
      return interaction.followUp({ content: "Campfire Cove installed.", ephemeral: true });
    }

    if (interaction.commandName === "setup-colour-roles") {
      await interaction.reply({ content: "Setting up colour roles...", ephemeral: true });
      await setupColourRoles(interaction.guild);
      return interaction.followUp({ content: "Colour roles ready.", ephemeral: true });
    }

    if (interaction.commandName === "setup-optional-pings") {
      await interaction.reply({ content: "Setting up optional pings...", ephemeral: true });
      await setupOptionalPings(interaction.guild);
      return interaction.followUp({ content: "Optional pings ready.", ephemeral: true });
    }

    if (interaction.commandName === "verify") {
      const verifiedRole = findRole(interaction.guild, "✅ Verified");
      const memberRole = findRole(interaction.guild, "❤️ Member");

      if (verifiedRole) await interaction.member.roles.add(verifiedRole);
      if (memberRole) await interaction.member.roles.add(memberRole);

      return interaction.reply({
        content: "You are now verified. Welcome to Campfire Cove ❤️",
        ephemeral: true
      });
    }

    if (interaction.commandName === "ticket") {
      return openTicket(interaction);
    }

    if (interaction.commandName === "close-ticket") {
      if (!interaction.channel.name.startsWith("ticket-")) {
        return interaction.reply({
          content: "Use this in a ticket channel.",
          ephemeral: true
        });
      }

      await interaction.reply("Closing in 5 seconds...");
      return setTimeout(() => interaction.channel.delete("Ticket closed"), 5000);
    }

    if (interaction.commandName === "post-custom") {
      return showCustomAnnouncementModal(interaction);
    }

    if (interaction.commandName === "post-update") {
      return postDefaultUpdate(interaction);
    }

    if (interaction.commandName === "revive-chat") {
      return postReviveChat(interaction);
    }

    if (interaction.commandName === "revive-vc") {
      return postReviveVc(interaction);
    }

    if (interaction.commandName === "daily-question") {
      return postDailyQuestion(interaction);
    }

    if (interaction.commandName === "giveaway") {
      return createGiveaway(interaction);
    }

    if (interaction.commandName === "timeout-user") {
      return timeoutUser(interaction);
    }
  } catch (error) {
    console.error(error);

    const message = "Something went wrong. Check the bot logs and make sure the bot role is high enough.";

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp({ content: message, ephemeral: true }).catch(() => {});
    }

    return interaction.reply({ content: message, ephemeral: true }).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
