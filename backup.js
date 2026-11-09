const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed, errorEmbed, createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('نظام النسخ الاحتياطي للسيرفر | Server Backup System')
    .addSubcommand(sub =>
      sub.setName('create')
        .setDescription('إنشاء نسخة احتياطية | Create a server backup')
        .addStringOption(opt => opt.setName('name').setDescription('اسم النسخة (اختياري)').setRequired(false)))
    .addSubcommand(sub =>
      sub.setName('info')
        .setDescription('معلومات النسخة الاحتياطية | Backup details')
        .addStringOption(opt => opt.setName('backup_id').setDescription('معرف النسخة (ID)').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('restore')
        .setDescription('استعادة النسخة الكاملة | Restore complete backup')
        .addStringOption(opt => opt.setName('backup_id').setDescription('معرف النسخة (ID)').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('restore-channels')
        .setDescription('استعادة الإكشانلات فقط | Restore channels only')
        .addStringOption(opt => opt.setName('backup_id').setDescription('معرف النسخة (ID)').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('restore-roles')
        .setDescription('استعادة الرولات فقط | Restore roles only')
        .addStringOption(opt => opt.setName('backup_id').setDescription('معرف النسخة (ID)').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (sub === 'create') {
      await interaction.deferReply();
      const customName = interaction.options.getString('name') || `نسخة ${guild.name} (${new Date().toLocaleDateString('ar-EG')})`;
      const backupId = `bk_${Math.random().toString(36).substring(2, 9)}`;

      const channelsData = guild.channels.cache.map(c => ({
        name: c.name,
        type: c.type,
        parent: c.parent ? c.parent.name : null,
        position: c.position
      }));

      const rolesData = guild.roles.cache.filter(r => r.id !== guild.id && !r.managed).map(r => ({
        name: r.name,
        color: r.hexColor,
        hoist: r.hoist,
        permissions: r.permissions.bitfield.toString(),
        position: r.position
      }));

      const backupObj = {
        id: backupId,
        guildId: guild.id,
        guildName: guild.name,
        name: customName,
        createdAt: new Date().toISOString(),
        channels: channelsData,
        roles: rolesData,
      };

      db.set(`backups.${backupId}`, backupObj);

      await interaction.editReply({
        embeds: [
          successEmbed(
            `📦 تم إنشاء النسخة الاحتياطية بنجاح!\n\n**الاسم:** ${customName}\n**المعرف (Backup ID):** \`${backupId}\`\n**الرومات المحفوظة:** ${channelsData.length}\n**الرتب المحفوظة:** ${rolesData.length}`,
            'تم إنشاء النسخة الاحتياطية | Backup Created'
          )
        ]
      });
    } else if (sub === 'info') {
      const backupId = interaction.options.getString('backup_id');
      const backup = db.get(`backups.${backupId}`);

      if (!backup) {
        return interaction.reply({ embeds: [errorEmbed('لم يتم العثور على نسخة احتياطية بهذا المعرف!')], ephemeral: true });
      }

      await interaction.reply({
        embeds: [createEmbed({
          title: `ℹ️ معلومات النسخة الاحتياطية: ${backup.name}`,
          fields: [
            { name: 'المعرف', value: `\`${backup.id}\``, inline: true },
            { name: 'اسم السيرفر الأصلي', value: backup.guildName, inline: true },
            { name: 'تاريخ الإنشاء', value: new Date(backup.createdAt).toLocaleString('ar-EG'), inline: true },
            { name: 'عدد الرومات', value: backup.channels.length.toString(), inline: true },
            { name: 'عدد الرتب', value: backup.roles.length.toString(), inline: true },
          ],
          color: '#5865F2'
        })]
      });
    } else if (sub === 'restore' || sub === 'restore-channels' || sub === 'restore-roles') {
      const backupId = interaction.options.getString('backup_id');
      const backup = db.get(`backups.${backupId}`);

      if (!backup) {
        return interaction.reply({ embeds: [errorEmbed('لم يتم العثور على نسخة احتياطية بهذا المعرف!')], ephemeral: true });
      }

      await interaction.reply({
        embeds: [createEmbed({
          title: '🔄 جاري استعادة النسخة الاحتياطية...',
          description: `يتم الآن استعادة عناصر النسخة: **${backup.name}**\nنوع الاستعادة: ${sub}`,
          color: '#FEE75C'
        })]
      });
    }
  }
};
