const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('عرض عدد أعضاء السيرفر بالتفصيل | Show detailed member count'),

  async execute(interaction) {
    const guild = interaction.guild;
    const members = await guild.members.fetch();

    const total = guild.memberCount;
    const humans = members.filter(m => !m.user.bot).size;
    const bots = members.filter(m => m.user.bot).size;

    await interaction.reply({
      embeds: [createEmbed({
        title: `📊 إحصائيات أعضاء سيرفر: ${guild.name}`,
        fields: [
          { name: '👥 إجمالي الأعضاء', value: `**${total}**`, inline: true },
          { name: '👤 الأعضاء الحقيقيون', value: `**${humans}**`, inline: true },
          { name: '🤖 البوتات', value: `**${bots}**`, inline: true },
        ],
        color: '#5865F2'
      })]
    });
  }
};
