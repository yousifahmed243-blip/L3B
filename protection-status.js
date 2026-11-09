const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('protection-status')
    .setDescription('عرض حالة الحماية | View protection status')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const modules = db.get('protection.modules', {
      anti_ban: true,
      anti_channel: true,
      anti_role: true,
      anti_bot: true,
      anti_spam: true
    });
    const limits = db.get('protection.limits', {});
    const whitelistUsers = db.get('protection.whitelist.users', []);
    const whitelistRoles = db.get('protection.whitelist.roles', []);

    const icon = (val) => val ? '✅ مفعل' : '❌ معطل';

    const fields = [
      { name: '🛡️ الحماية العامة (Global Shield)', value: db.get('protection.enabled', true) ? '🟢 تعمل بكفاءة' : '🔴 متوقفة', inline: false },
      { name: '🔨 منع البان والطرد (Anti-Ban/Kick)', value: icon(modules.anti_ban), inline: true },
      { name: '📁 حماية الرومات (Anti-Channel)', value: icon(modules.anti_channel), inline: true },
      { name: '👑 حماية الرتب (Anti-Role)', value: icon(modules.anti_role), inline: true },
      { name: '🤖 منع البوتات المجهولة (Anti-Bot)', value: icon(modules.anti_bot), inline: true },
      { name: '🔗 منع الروابط والسبام (Anti-Spam)', value: icon(modules.anti_spam), inline: true },
      { name: '📜 أعضاء الوايت ليست', value: `${whitelistUsers.length} مستخدم | ${whitelistRoles.length} رتبة`, inline: true },
    ];

    await interaction.reply({
      embeds: [createEmbed({
        title: '🛡️ لوحة معلومات الحماية والأمان | Server Protection Status',
        description: 'تقرير فوري ومفصل عن حالة جميع أنظمة الدفاع ضد السبام والريد والتخريب.',
        fields,
        color: '#5865F2'
      })]
    });
  }
};
