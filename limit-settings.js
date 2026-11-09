const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed, createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('limit-settings')
    .setDescription('إعدادات حدود العقوبات | Limit settings and punishments')
    .addSubcommand(sub =>
      sub.setName('set')
        .setDescription('تعيين حد وعقوبة لنوع معين من الإجراءات | Set action limit and punishment')
        .addStringOption(opt =>
          opt.setName('action')
            .setDescription('نوع الإجراء | Action type')
            .setRequired(true)
            .addChoices(
              { name: 'حظر الأعضاء (Ban)', value: 'ban' },
              { name: 'طرد الأعضاء (Kick)', value: 'kick' },
              { name: 'حذف الرومات (Channel Delete)', value: 'channel_delete' },
              { name: 'حذف الرتب (Role Delete)', value: 'role_delete' },
            ))
        .addIntegerOption(opt =>
          opt.setName('limit')
            .setDescription('الحد الأقصى المسموح به في الساعة | Max actions per hour')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(20))
        .addStringOption(opt =>
          opt.setName('punishment')
            .setDescription('نوع العقوبة | Punishment')
            .setRequired(true)
            .addChoices(
              { name: 'حظر الفاعل (Ban)', value: 'ban' },
              { name: 'طرد الفاعل (Kick)', value: 'kick' },
              { name: 'سحب رتب الفاعل (Remove Roles)', value: 'remove_roles' },
            )))
    .addSubcommand(sub =>
      sub.setName('view')
        .setDescription('عرض الإعدادات الحالية لحدود العقوبات | View current limit punishment settings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const action = interaction.options.getString('action');
      const limit = interaction.options.getInteger('limit');
      const punishment = interaction.options.getString('punishment');

      db.set(`protection.limits.${action}`, { limit, punishment });

      await interaction.reply({
        embeds: [
          successEmbed(
            `تم تحديث حد إجراء **${action}**:\n• الحد الأقصى: **${limit}** في الساعة\n• العقوبة المطبقة: **${punishment}**`,
            'حدود الأمان | Action Limit Configured'
          )
        ]
      });
    } else {
      const limits = db.get('protection.limits', {});
      const fields = Object.entries(limits).map(([act, conf]) => ({
        name: `⚡ إجراء: ${act}`,
        value: `الحد: **${conf.limit}** / ساعة | العقوبة: **${conf.punishment}**`,
        inline: false
      }));

      await interaction.reply({
        embeds: [createEmbed({
          title: '⚙️ إعدادات حدود الإجراءات والعقوبات الحالية',
          fields: fields.length > 0 ? fields : [{ name: 'لا توجد حدود مخصصة', value: 'يتم تطبيق الحدود الافتراضية (3 إجراءات/ساعة).' }],
          color: '#5865F2'
        })]
      });
    }
  }
};
