const db = require("../database/database");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

db.prepare(`
  CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    message_id TEXT,
    suggestion TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    status_reason TEXT,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0
  )
`).run();

try {
  db.prepare(`ALTER TABLE suggestions ADD COLUMN status_reason TEXT`).run();
} catch (error) {}

db.prepare(`
  CREATE TABLE IF NOT EXISTS suggestion_votes (
    suggestion_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    vote TEXT NOT NULL,
    PRIMARY KEY (suggestion_id, user_id)
  )
`).run();

function createSuggestion(guildId, userId, suggestion) {
  const result = db.prepare(`
    INSERT INTO suggestions (guild_id, user_id, suggestion)
    VALUES (?, ?, ?)
  `).run(guildId, userId, suggestion);

  return result.lastInsertRowid;
}

function saveSuggestionMessage(id, messageId) {
  db.prepare(`
    UPDATE suggestions
    SET message_id = ?
    WHERE id = ?
  `).run(messageId, id);
}

function getSuggestion(id) {
  return db.prepare(`
    SELECT * FROM suggestions
    WHERE id = ?
  `).get(id);
}

function setVote(suggestionId, userId, vote) {
  const existing = db.prepare(`
    SELECT vote FROM suggestion_votes
    WHERE suggestion_id = ? AND user_id = ?
  `).get(suggestionId, userId);

  if (existing && existing.vote === vote) return;

  if (existing) {
    db.prepare(`
      UPDATE suggestion_votes
      SET vote = ?
      WHERE suggestion_id = ? AND user_id = ?
    `).run(vote, suggestionId, userId);
  } else {
    db.prepare(`
      INSERT INTO suggestion_votes (suggestion_id, user_id, vote)
      VALUES (?, ?, ?)
    `).run(suggestionId, userId, vote);
  }

  const upvotes = db.prepare(`
    SELECT COUNT(*) AS count FROM suggestion_votes
    WHERE suggestion_id = ? AND vote = 'up'
  `).get(suggestionId).count;

  const downvotes = db.prepare(`
    SELECT COUNT(*) AS count FROM suggestion_votes
    WHERE suggestion_id = ? AND vote = 'down'
  `).get(suggestionId).count;

  db.prepare(`
    UPDATE suggestions
    SET upvotes = ?, downvotes = ?
    WHERE id = ?
  `).run(upvotes, downvotes, suggestionId);
}

function updateStatus(suggestionId, status, reason = null) {
  db.prepare(`
    UPDATE suggestions
    SET status = ?, status_reason = ?
    WHERE id = ?
  `).run(status, reason, suggestionId);
}

function buildSuggestionEmbed(suggestion) {
  const statusEmoji = {
    Pending: "💡",
    Accepted: "✅",
    Denied: "❌",
    Review: "💬"
  };

  return new EmbedBuilder()
    .setColor(
      suggestion.status === "Accepted" ? "#22C55E" :
      suggestion.status === "Denied" ? "#EF4444" :
      suggestion.status === "Review" ? "#F59E0B" :
      "#E76F51"
    )
    .setTitle(`${statusEmoji[suggestion.status] || "💡"} Suggestion #${suggestion.id}`)
    .setDescription(suggestion.suggestion)
    .addFields(
      { name: "Suggested By", value: `<@${suggestion.user_id}>`, inline: true },
      { name: "Status", value: suggestion.status, inline: true },
      ...(suggestion.status_reason
        ? [{ name: "Reason", value: suggestion.status_reason, inline: false }]
        : []),
      { name: "Votes", value: `👍 ${suggestion.upvotes}  |  👎 ${suggestion.downvotes}`, inline: false }
    )
    .setFooter({ text: "Campfire Cove • Suggestions" })
    .setTimestamp();
}

function buildSuggestionButtons(suggestionId) {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`suggest_up_${suggestionId}`)
        .setLabel("Upvote")
        .setEmoji("👍")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`suggest_down_${suggestionId}`)
        .setLabel("Downvote")
        .setEmoji("👎")
        .setStyle(ButtonStyle.Danger)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`suggest_accept_${suggestionId}`)
        .setLabel("Accept")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`suggest_review_${suggestionId}`)
        .setLabel("Review")
        .setEmoji("💬")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(`suggest_deny_${suggestionId}`)
        .setLabel("Deny")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger)
    )
  ];
}

module.exports = {
  createSuggestion,
  saveSuggestionMessage,
  getSuggestion,
  setVote,
  updateStatus,
  buildSuggestionEmbed,
  buildSuggestionButtons
};
