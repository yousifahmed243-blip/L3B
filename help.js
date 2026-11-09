const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('عرض قائمة جميع الأوامر المتاحة | Shows all available commands'),

  async execute(interaction) {
    const embed = createEmbed({
      title: '🛡️ قائمة أوامر البوت الشاملة | Help Menu',
      description: 'أهلاً بك! إليك قائمة بكافة أوامر البوت المنظمة حسب الفئات:',
      fields: [
        {
          name: '🔨 أوامر الإشراف (Moderation)',
          value: '`/ban`, `/unban`, `/kick`, `/mute`, `/unmute`, `/timeout`, `/untimeout`, `/vmute`, `/vunmute`, `/warn`, `/warnings`, `/clear-warnings`, `/clear`, `/role`'
        },
        {
          name: '📁 التحكم بالقنوات (Channels)',
          value: '`/lock`, `/unlock`, `/hide`, `/unhide`, `/nuke`, `/slowmode`'
        },
        {
          name: '🛡️ الحماية والوايت ليست (Protection & Limits)',
          value: '`/protection toggle`, `/protection status`, `/togglepro`, `/limit-settings set`, `/limit-settings view`, `/whitelist grant role/user`, `/whitelist revoke`, `/whitelist view`'
        },
        {
          name: '📦 النسخ الاحتياطي (Backup)',
          value: '`/backup create`, `/backup info`, `/backup restore`, `/backup restore-channels`, `/backup restore-roles`'
        },
        {
          name: '🤖 الردود التلقائية (Auto Response)',
          value: '`/autoresponse add`, `/autoresponse remove`, `/autoresponse list`, `/autoresponse clear`'
        },
        {
          name: '🏪 المتجر والطلبات (Store & Delivery)',
          value: '`/delivery`, `/review`, `/setreviewchannel`, `/announce`'
        },
        {
          name: 'ℹ️ معلومات عامة (General & Stats)',
          value: '`/ping`, `/botinfo`, `/serverinfo`, `/userinfo`, `/membercount`, `/roles`, `/emojis`, `/avatar`, `/banner`, `/invite`, `/uptime`'
        }
      ],
      color: '#5865F2'
    });

    await interaction.reply({ embeds: [embed] });
  }
};
