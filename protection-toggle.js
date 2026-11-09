const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('protection')
    .setDescription('إدارة أنظمة الحماية | Protection management')
    .addSubcommand(sub =>
      sub.setName('toggle')
        .setDescription('تشغيل/إيقاف حماية | Toggle protection module')
        .addStringOption(opt =>
          opt.setName('module')
            .setDescription('نوع الحماية | Module')
            .setRequired(true)
            .addChoices(
              { name: 'حماية منع الطرد والحظر (Anti-Ban/Kick)', value: 'anti_ban' },
              { name: 'حماية الرومات (Anti-Channel)', value: 'anti_channel' },
              { name: 'حماية الرتب (Anti-Role)', value: 'anti_role' },
              { name: 'حماية البوتات (Anti-Bot)', value: 'anti_bot' },
              { name: 'حماية الروابط والسبام (Anti-Spam)', value: 'anti_spam' }
            ))
        .addBooleanOption(opt =>
          opt.setName('status')
            .setDescription('الحالة | Status')
            .setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const moduleKey = interaction.options.getString('module');
    const status = interaction.options.getBoolean('status');

    db.set(`protection.modules.${moduleKey}`, status);

    const statusAr = status ? '🟢 مفعلة (Enabled)' : '🔴 معطلة (Disabled)';
    await interaction.reply({
      embeds: [successEmbed(`تم تغيير حالة نظام الحماية **${moduleKey}** إلى: ${statusAr}`, 'إعدادات الحماية | Protection Updated')]
    });
  }
};
