const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('عرض قائمة رتب السيرفر | List server roles'),

  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => `<@&${r.id}>`)
      .slice(0, 40);

    await interaction.reply({
      embeds: [createEmbed({
        title: `👑 رتب السيرفر (${interaction.guild.roles.cache.size - 1})`,
        description: roles.join(' ') || 'لا توجد رتب في هذا السيرفر!',
        color: '#5865F2'
      })]
    });
  }
};
