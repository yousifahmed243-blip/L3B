const fs = require('fs');
const path = require('path');

function loadCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands');
  let loadedCount = 0;

  function crawl(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        crawl(res);
      } else if (entry.name.endsWith('.js')) {
        try {
          const command = require(res);
          if (Array.isArray(command)) {
            for (const cmd of command) {
              if (cmd.data && cmd.execute) {
                client.commands.set(cmd.data.name, cmd);
                loadedCount++;
              }
            }
          } else if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            loadedCount++;
          }
        } catch (err) {
          console.error(`[LOAD ERROR] Failed to load command at ${res}:`, err.message);
        }
      }
    }
  }

  crawl(commandsPath);
  console.log(`\x1b[36m[COMMANDS] Successfully loaded ${loadedCount} modular slash commands!\x1b[0m`);
}

module.exports = { loadCommands };
