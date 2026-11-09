const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('إلغاء حظر عضو من السيرفر | Unban a user')
    .addStringOption(option =>
      option.setName('user_id')
        .setDescription('معرف المستخدم | User ID to unban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('السبب | Reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('user_id');
    const reason = interaction.options.getString('reason') || 'إلغاء حظر بواسطة الإدارة | Unbanned by Admin';

    try {
      const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
      if (!ban) {
        return interaction.reply({
          embeds: [errorEmbed('هذا المستخدم غير محظور في السيرفر! | User is not banned.')],
          ephemeral: true
        });
      }

      await interaction.guild.bans.remove(userId, reason);
      await interaction.reply({
        embeds: [successEmbed(`🔓 تم إلغاء حظر **${ban.user.tag}** بنجاح.\n**السبب:** ${reason}`, 'إلغاء الحظر | User Unbanned')]
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`حدث خطأ أثناء فك الحظر: ${err.message}`)],
        ephemeral: true
      });
    }
  }
};
