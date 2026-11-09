const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('عرض مدة تشغيل البوت | Show bot uptime'),

  async execute(interaction, client) {
    let totalSeconds = client.uptime / 1000;
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const timeString = `${days} يوم، ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية`;

    await interaction.reply({
      embeds: [createEmbed({
        title: '⏱️ مدة تشغيل البوت المتواصلة | Bot Uptime',
        description: `البوت يعمل دون انقطاع منذ:\n**${timeString}**`,
        color: '#57F287'
      })]
    });
  }
};
