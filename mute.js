const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('إسكات عضو (28 يوم) | Mute a user (28 days)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('العضو المراد إسكاته | Member to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب الإسكات | Reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'إسكات لمدة 28 يوم | 28 days mute';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) {
      return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')], ephemeral: true });
    }

    // 28 days in milliseconds
    const durationMs = 28 * 24 * 60 * 60 * 1000;

    try {
      await member.timeout(durationMs, reason);
      await interaction.reply({
        embeds: [successEmbed(`🔇 تم إسكات **${targetUser.tag}** لمدة 28 يوم.\n**السبب:** ${reason}`, 'إسكات عضو | Member Muted')]
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`فشل الإسكات: ${err.message}`)], ephemeral: true });
    }
  }
};
