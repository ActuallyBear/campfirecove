# Campfire Cove Bot

A clean rebuild of HavenBot for the Campfire Cove Discord community.

## Included

- Safe, repeatable full-server installer
- Verification and welcome system
- Self roles, colour roles and notification roles
- Tickets and private staff access
- XP, ranks and leaderboard
- Suggestions and voting
- Quotes, starboard and counting
- Warnings, kicks, bans, timeouts, purge, slowmode and channel locks
- Join, leave, edit, delete and moderation logs

## Railway

Set `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID` and a persistent volume mounted at `/data`.

Run `npm run deploy` once to register slash commands, then use `/install-campfire-cove` in Discord. After installation, run `/setup-role-panels`.
