const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription("عرض تحذيرات عضو | View a user's warnings")
    .addUserOption(option =>
      option.setName('target')
        .setDescription('العضو المراد استعراض تحذيراته | Target user')
        .setRequired(true)),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const warns = db.get(`warnings.${interaction.guild.id}.${targetUser.id}`, []);

    if (warns.length === 0) {
      return interaction.reply({
        embeds: [createEmbed({
          title: `📋 تحذيرات: ${targetUser.tag}`,
          description: '✅ هذا العضو سجله نظيف ولا توجد عليه أي تحذيرات مسجلة!',
          color: '#57F287'
        })]
      });
    }

    const fields = warns.map((w, idx) => ({
      name: `تحذير #${idx + 1} | ID: ${w.id}`,
      value: `**السبب:** ${w.reason}\n**بواسطة:** ${w.moderator}\n**التاريخ:** ${new Date(w.timestamp).toLocaleDateString('ar-EG')}`
    }));

    await interaction.reply({
      embeds: [createEmbed({
        title: `📋 تحذيرات العضو: ${targetUser.tag} (${warns.length})`,
        fields,
        color: '#FEE75C'
      })]
    });
  }
};
