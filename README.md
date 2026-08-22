# Campfire Cove Bot

The Discord community bot for **Campfire Cove** — *Gather by the fire. Stay for the people.*

## Features

- Verification and welcome messages
- Self roles, colour roles and optional notification roles
- Tickets and staff logs
- Warnings, timeouts, kicks, bans, purge, lock and slowmode
- XP, ranks, leaderboards and level rewards
- Profiles with custom backgrounds and colours
- Suggestions with voting and staff statuses
- Counting, quotes, starboard and server statistics
- Rules and custom announcement panels

## Start a fresh Campfire Cove server

1. Create a Discord application and bot in the Developer Portal.
2. Enable **Server Members**, **Message Content**, and **Presence** privileged intents.
3. Copy `env.example` to `.env` and add the new bot token, application ID and server ID.
4. Run `npm install`.
5. Run `npm run deploy` to register the slash commands in the new server.
6. Run `npm start`.
7. Use `/exportids` and `/listroles`, then replace the old IDs in `src/config/channels.js`, `src/config/roles.js`, and `src/config/categories.js` with IDs from the new server.
8. Post the panels with the `/setup-*` commands after the IDs are configured.

## Railway

Set `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, and `DATA_DIR=/data` as Railway variables. Mount a volume at `/data` so levels, suggestions, profiles and counting data survive redeployments.

## Important

- Never commit or upload `.env`.
- Only run one live copy of the bot at a time.
- Give the bot **Manage Roles**, **Manage Channels**, **Manage Messages**, **Moderate Members**, **Kick Members**, and **Ban Members** permissions.
- Place the bot's role above every role it needs to assign or moderate.
