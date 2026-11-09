const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojis')
    .setDescription('عرض قائمة إيموجيات السيرفر | List server emojis'),

  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache;

    if (emojis.size === 0) {
      return interaction.reply({ embeds: [createEmbed({ title: '😃 إيموجيات السيرفر', description: 'لا توجد إيموجيات مخصصة في هذا السيرفر!' })] });
    }

    const animated = emojis.filter(e => e.animated).map(e => e.toString()).join(' ');
    const normal = emojis.filter(e => !e.animated).map(e => e.toString()).join(' ');

    await interaction.reply({
      embeds: [createEmbed({
        title: `😃 إيموجيات السيرفر (${emojis.size})`,
        fields: [
          { name: 'الثابتة', value: normal.slice(0, 1020) || 'لا يوجد' },
          { name: 'المتحركة', value: animated.slice(0, 1020) || 'لا يوجد' },
        ],
        color: '#5865F2'
      })]
    });
  }
};
