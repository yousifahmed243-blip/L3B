const { Events } = require('discord.js');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    // Check if subcommand belongs to a group or direct command
    const commandName = interaction.commandName;
    const command = client.commands.get(commandName);

    if (!command) {
      console.warn(`[COMMAND NOT FOUND] No command matching ${commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`[EXECUTION ERROR] Command ${commandName} failed:`, error);
      const replyPayload = {
        embeds: [
          errorEmbed(
            'حدث خطأ أثناء تنفيذ هذا الأمر:\n' + error.message,
            '❌ فشل التنفيذ | Command Failed'
          )
        ],
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyPayload).catch(() => null);
      } else {
        await interaction.reply(replyPayload).catch(() => null);
      }
    }
  }
};
