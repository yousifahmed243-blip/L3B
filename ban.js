const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('حظر عضو من السيرفر | Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('العضو المراد حظره | Target user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب الحظر | Ban reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'لم يتم تحديد سبب | No reason provided';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (member && !member.bannable) {
      return interaction.reply({
        embeds: [errorEmbed('لا يمكنني حظر هذا العضو بسبب رتبته العالية! | Cannot ban this user due to role hierarchy.')],
        ephemeral: true
      });
    }

    try {
      await interaction.guild.members.ban(targetUser.id, { reason });
      await interaction.reply({
        embeds: [successEmbed(`🔨 تم حظر **${targetUser.tag}** بنجاح.\n**السبب:** ${reason}`, 'حظر عضو | User Banned')]
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`فشل تنفيذ الحظر: ${err.message}`)],
        ephemeral: true
      });
    }
  }
};
