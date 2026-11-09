const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('جعل البوت يغادر الروم الصوتي | Make the bot leave the voice channel'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      return interaction.reply({
        embeds: [errorEmbed('البوت غير متواجد في أي روم صوتي في هذا السيرفر حالياً!')],
        ephemeral: true
      });
    }

    try {
      connection.destroy();
      await interaction.reply({
        embeds: [successEmbed('👋 تم مغادرة الروم الصوتي وقطع الاتصال بنجاح.', 'مغادرة الروم الصوتي | Voice Disconnected')]
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`حدث خطأ أثناء المغادرة: ${err.message}`)],
        ephemeral: true
      });
    }
  }
};
