const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('طرد عضو من السيرفر | Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('العضو المراد طرده | Target user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب الطرد | Reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'لم يتم تحديد سبب | No reason provided';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) {
      return interaction.reply({ embeds: [errorEmbed('العضو غير موجود في السيرفر!')], ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ embeds: [errorEmbed('لا أملك صلاحيات لطرد هذا العضو!')], ephemeral: true });
    }

    try {
      await member.kick(reason);
      await interaction.reply({
        embeds: [successEmbed(`👢 تم طرد **${targetUser.tag}** بنجاح.\n**السبب:** ${reason}`, 'طرد عضو | Member Kicked')]
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`فشل تنفيذ الطرد: ${err.message}`)], ephemeral: true });
    }
  }
};
