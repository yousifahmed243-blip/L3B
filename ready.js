const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`\x1b[32m[ONLINE] Logged in as ${client.user.tag} (ID: ${client.user.id})\x1b[0m`);
    console.log(`[SERVERS] Serving in ${client.guilds.cache.size} servers with ${client.users.cache.size} cached members.`);

    // Set interactive bot status
    client.user.setPresence({
      activities: [
        {
          name: `/help | ${client.guilds.cache.size} Servers`,
          type: ActivityType.Watching
        }
      ],
      status: 'online'
    });
  }
};
