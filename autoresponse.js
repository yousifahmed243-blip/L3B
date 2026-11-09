const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed, errorEmbed, createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoresponse')
    .setDescription('إدارة الردود التلقائية | Auto-response management')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('إضافة رد تلقائي جديد | Add a new auto response')
        .addStringOption(opt => opt.setName('trigger').setDescription('الكلمة المفتاحية').setRequired(true))
        .addStringOption(opt => opt.setName('response').setDescription('الرد المطلوب').setRequired(true))
        .addStringOption(opt =>
          opt.setName('match_type')
            .setDescription('نوع المطابقة')
            .setRequired(false)
            .addChoices(
              { name: 'تحتوي الكلمة (Contains)', value: 'contains' },
              { name: 'تطابق تام (Exact)', value: 'exact' }
            )))
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('حذف رد تلقائي | Remove an auto response')
        .addStringOption(opt => opt.setName('trigger').setDescription('الكلمة المراد حذف ردها').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('عرض جميع الردود التلقائية | List all auto responses'))
    .addSubcommand(sub =>
      sub.setName('clear')
        .setDescription('حذف جميع الردود التلقائية | Delete all auto responses'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'add') {
      const trigger = interaction.options.getString('trigger');
      const response = interaction.options.getString('response');
      const matchType = interaction.options.getString('match_type') || 'contains';

      const newAR = {
        id: Date.now().toString(),
        trigger,
        response,
        matchType,
        author: interaction.user.tag
      };

      db.push(`autoresponses.${guildId}`, newAR);
      await interaction.reply({
        embeds: [successEmbed(`✅ تم إضافة الرد التلقائي بنجاح!\n**الكلمة:** ${trigger}\n**الرد:** ${response}\n**النوع:** ${matchType}`)]
      });
    } else if (sub === 'remove') {
      const trigger = interaction.options.getString('trigger').toLowerCase().trim();
      let list = db.get(`autoresponses.${guildId}`, []);
      const before = list.length;
      list = list.filter(ar => ar.trigger.toLowerCase().trim() !== trigger && ar.id !== trigger);
      db.set(`autoresponses.${guildId}`, list);

      if (list.length === before) {
        return interaction.reply({ embeds: [errorEmbed('لم يتم العثور على رد تلقائي بهذه الكلمة!')], ephemeral: true });
      }
      await interaction.reply({ embeds: [successEmbed(`🗑️ تم حذف الرد التلقائي المرتبط بـ "${trigger}".`)] });
    } else if (sub === 'list') {
      const list = db.get(`autoresponses.${guildId}`, []);
      if (list.length === 0) {
        return interaction.reply({ embeds: [createEmbed({ title: '🤖 الردود التلقائية', description: 'لا توجد ردود تلقائية مسجلة في هذا السيرفر حالياً.' })] });
      }

      const fields = list.map((ar, i) => ({
        name: `#${i + 1} | ${ar.trigger} (${ar.matchType})`,
        value: `**الرد:** ${ar.response}`
      }));

      await interaction.reply({
        embeds: [createEmbed({
          title: `🤖 قائمة الردود التلقائية (${list.length})`,
          fields,
          color: '#5865F2'
        })]
      });
    } else if (sub === 'clear') {
      db.set(`autoresponses.${guildId}`, []);
      await interaction.reply({ embeds: [successEmbed('🧹 تم مسح كافة الردود التلقائية للسيرفر بنجاح.')] });
    }
  }
};
