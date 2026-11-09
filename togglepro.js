const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const config = require('../../config.json');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('togglepro')
    .setDescription('تفعيل/تعطيل الحماية الكاملة (للمطورين) | Enable/Disable full protection (Devs only)'),

  async execute(interaction) {
    const isOwner = interaction.user.id === interaction.guild.ownerId || (config.ownerIds && config.ownerIds.includes(interaction.user.id));
    if (!isOwner) {
      return interaction.reply({
        embeds: [errorEmbed('هذا الأمر مخصص لمالك السيرفر ومطوري البوت فقط! | Devs & Owner Only')],
        ephemeral: true
      });
    }

    const current = db.get('protection.enabled', true);
    const updated = !current;
    db.set('protection.enabled', updated);

    await interaction.reply({
      embeds: [
        successEmbed(
          updated
            ? '🛡️ تم **تفعيل** الحماية الكاملة والشاملة للسيرفر بنجاح.'
            : '⚠️ تم **تعطيل** الحماية الكاملة (Panic Mode / Unprotected).',
          'مفتاح الحماية الرئيسية | Full Protection Master Toggle'
        )
      ]
    });
  }
};
