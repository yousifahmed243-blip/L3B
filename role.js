const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('إضافة أو سحب رتبة من عضو | Add or remove a role from a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('العضو | Target user')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('الرتبة | Role')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('action')
        .setDescription('الإجراء المطلوب | Action')
        .setRequired(true)
        .addChoices(
          { name: 'إضافة الرتبة (Add Role)', value: 'add' },
          { name: 'سحب الرتبة (Remove Role)', value: 'remove' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const role = interaction.options.getRole('role');
    const action = interaction.options.getString('action');

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')], ephemeral: true });

    if (!role.editable) {
      return interaction.reply({
        embeds: [errorEmbed('لا يمكنني التحكم في هذه الرتبة لأنها أعلى من رتبة البوت!')],
        ephemeral: true
      });
    }

    try {
      if (action === 'add') {
        await member.roles.add(role.id, 'بواسطة أمر /role');
        await interaction.reply({
          embeds: [successEmbed(`✅ تم منح رتبة **${role.name}** للعضو **${targetUser.tag}**.`, 'إضافة رتبة | Role Added')]
        });
      } else {
        await member.roles.remove(role.id, 'بواسطة أمر /role');
        await interaction.reply({
          embeds: [successEmbed(`🗑️ تم سحب رتبة **${role.name}** من العضو **${targetUser.tag}**.`, 'سحب رتبة | Role Removed')]
        });
      }
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`فشل تنفيذ الأمر: ${err.message}`)], ephemeral: true });
    }
  }
};
