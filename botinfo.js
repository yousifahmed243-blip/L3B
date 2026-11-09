const { SlashCommandBuilder, version } = require('discord.js');
const os = require('os');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('عرض معلومات البوت التقنية | Show bot technical information'),

  async execute(interaction, client) {
    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

    await interaction.reply({
      embeds: [createEmbed({
        title: `🤖 معلومات البوت التقنية: ${client.user.username}`,
        fields: [
          { name: '⚡ إصدار Discord.js', value: `v${version}`, inline: true },
          { name: '🟢 بيئة التشغيل Node.js', value: process.version, inline: true },
          { name: '💾 استهلاك الذاكرة', value: `${memUsed} MB`, inline: true },
          { name: '🌐 السيرفرات', value: client.guilds.cache.size.toString(), inline: true },
          { name: '👥 المستخدمون المتصلون', value: client.users.cache.size.toString(), inline: true },
          { name: '💻 نظام التشغيل', value: `${os.type()} ${os.arch()}`, inline: true },
        ],
        color: '#5865F2',
        thumbnail: client.user.displayAvatarURL()
      })]
    });
  }
};
