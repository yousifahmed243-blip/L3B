const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stay247')
    .setDescription('تفعيل/تعطيل بقاء البوت 24/7 في الروم الصوتي | Toggle 24/7 voice stay')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const current = db.get(`voice.${interaction.guild.id}.stay247`, false);
    const updated = !current;
    db.set(`voice.${interaction.guild.id}.stay247`, updated);

    await interaction.reply({
      embeds: [
        successEmbed(
          updated
            ? '🟢 تم **تفعيل** نظام البقاء في الروم الصوتي 24/7. سيظل البوت متصلاً دائماً حتى لو خرج جميع الأعضاء.'
            : '🔴 تم **تعطيل** نظام البقاء 24/7.',
          'نظام البقاء الصوتي | 24/7 Voice Stay'
        )
      ]
    });
  }
};
