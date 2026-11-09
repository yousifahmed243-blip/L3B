/**
 * Deploy Slash Commands Script
 * Run with: npm run deploy OR node deploy-commands.js
 */
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

// Recursively read all command files from categories
function readCommands(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readCommands(fullPath);
    } else if (file.endsWith('.js')) {
      const command = require(fullPath);
      if (command.data && typeof command.data.toJSON === 'function') {
        commands.push(command.data.toJSON());
      } else if (Array.isArray(command)) {
        command.forEach(cmd => {
          if (cmd.data && typeof cmd.data.toJSON === 'function') {
            commands.push(cmd.data.toJSON());
          }
        });
      }
    }
  }
}

readCommands(commandsPath);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`[DEPLOY] Started refreshing ${commands.length} application (/) commands.`);

    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    let data;
    if (guildId) {
      // Guild-specific registration (Instant updates for testing)
      data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`\x1b[32m[SUCCESS] Successfully registered ${data.length} slash commands in guild ${guildId}!\x1b[0m`);
    } else {
      // Global registration (Available across all servers, takes ~5-15 mins to propagate globally)
      data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      console.log(`\x1b[32m[SUCCESS] Successfully registered ${data.length} global slash commands!\x1b[0m`);
    }
  } catch (error) {
    console.error('\x1b[31m[ERROR] Failed to register slash commands:\x1b[0m', error);
  }
})();
