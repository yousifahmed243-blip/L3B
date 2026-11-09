/**
 * Shield Bot - Main Entry Point
 * Discord.js v14 Modular Architecture
 */
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.User
  ]
});

// Collections for slash commands and cooldowns
client.commands = new Collection();
client.cooldowns = new Collection();

// Load commands and events dynamically
loadCommands(client);
loadEvents(client);

// Login using DISCORD_TOKEN
const token = process.env.DISCORD_TOKEN;
if (!token || token === 'your_bot_token_here') {
  console.error('\x1b[31m[ERROR] Please provide a valid DISCORD_TOKEN in your .env file!\x1b[0m');
  process.exit(1);
}

client.login(token).catch(err => {
  console.error('\x1b[31m[ERROR] Failed to login to Discord:\x1b[0m', err.message);
});

// Process error handling to prevent bot crashing
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Anti-Crash] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
  console.error('[Anti-Crash] Uncaught Exception:', err, 'origin:', origin);
});
