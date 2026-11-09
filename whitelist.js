const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed, createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('إدارة قائمة الوايت ليست | Whitelist permissions')
    .addSubcommandGroup(group =>
      group.setName('grant')
        .setDescription('منح صلاحية الوايت ليست | Grant whitelist')
        .addSubcommand(sub =>
          sub.setName('role')
            .setDescription('منح صلاحية لرتبة | Grant whitelist to a role')
            .addRoleOption(opt => opt.setName('role').setDescription('الرتبة').setRequired(true)))
        .addSubcommand(sub =>
          sub.setName('user')
            .setDescription('منح صلاحية لمستخدم | Grant whitelist to a user')
            .addUserOption(opt => opt.setName('user').setDescription('المستخدم').setRequired(true))))
    .addSubcommandGroup(group =>
      group.setName('revoke')
        .setDescription('سحب صلاحية من الوايت ليست | Revoke whitelist')
        .addSubcommand(sub =>
          sub.setName('role')
            .setDescription('سحب صلاحية من رتبة | Revoke whitelist from a role')
            .addRoleOption(opt => opt.setName('role').setDescription('الرتبة').setRequired(true)))
        .addSubcommand(sub =>
          sub.setName('user')
            .setDescription('سحب صلاحية من مستخدم | Revoke whitelist from a user')
            .addUserOption(opt => opt.setName('user').setDescription('المستخدم').setRequired(true))))
    .addSubcommand(sub =>
      sub.setName('view')
        .setDescription('عرض صلاحيات الوايت ليست الحالية | View current whitelist'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const group = interaction.options.getSubcommandGroup(false);
    const sub = interaction.options.getSubcommand();

    if (group === 'grant') {
      if (sub === 'role') {
        const role = interaction.options.getRole('role');
        const roles = db.get('protection.whitelist.roles', []);
        if (!roles.includes(role.id)) roles.push(role.id);
        db.set('protection.whitelist.roles', roles);
        return interaction.reply({ embeds: [successEmbed(`✅ تم منح صلاحية الوايت ليست للرتبة: <@&${role.id}>`)] });
      } else {
        const user = interaction.options.getUser('user');
        const users = db.get('protection.whitelist.users', []);
        if (!users.includes(user.id)) users.push(user.id);
        db.set('protection.whitelist.users', users);
        return interaction.reply({ embeds: [successEmbed(`✅ تم منح صلاحية الوايت ليست للمستخدم: <@${user.id}>`)] });
      }
    } else if (group === 'revoke') {
      if (sub === 'role') {
        const role = interaction.options.getRole('role');
        let roles = db.get('protection.whitelist.roles', []);
        roles = roles.filter(r => r !== role.id);
        db.set('protection.whitelist.roles', roles);
        return interaction.reply({ embeds: [successEmbed(`🗑️ تم سحب صلاحية الوايت ليست من الرتبة: <@&${role.id}>`)] });
      } else {
        const user = interaction.options.getUser('user');
        let users = db.get('protection.whitelist.users', []);
        users = users.filter(u => u !== user.id);
        db.set('protection.whitelist.users', users);
        return interaction.reply({ embeds: [successEmbed(`🗑️ تم سحب صلاحية الوايت ليست من المستخدم: <@${user.id}>`)] });
      }
    } else if (sub === 'view') {
      const users = db.get('protection.whitelist.users', []);
      const roles = db.get('protection.whitelist.roles', []);

      const userList = users.length > 0 ? users.map(u => `• <@${u}>`).join('\n') : '*لا يوجد مستخدمين مسجلين*';
      const roleList = roles.length > 0 ? roles.map(r => `• <@&${r}>`).join('\n') : '*لا توجد رتب مسجلة*';

      return interaction.reply({
        embeds: [createEmbed({
          title: '📜 قائمة الوايت ليست الحالية | Whitelist Permissions',
          fields: [
            { name: '👥 المستخدمون المصرح لهم', value: userList, inline: true },
            { name: '🛡️ الرتب المصرح لها', value: roleList, inline: true }
          ],
          color: '#5865F2'
        })]
      });
    }
  }
};
