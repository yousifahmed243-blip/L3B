const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vunmute')
    .setDescription('إزالة الإسكات الصوتي عن عضو | Voice unmute a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('العضو | Target member')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member || !member.voice.channel) {
      return interaction.reply({ embeds: [errorEmbed('العضو غير متواجد في روم صوتي حالياً!')], ephemeral: true });
    }

    try {
      await member.voice.setMute(false, 'إزالة الإسكات الصوتي');
      await interaction.reply({
        embeds: [successEmbed(`🎙️ تم إزالة الإسكات الصوتي عن **${targetUser.tag}**.`, 'إلغاء الإسكات الصوتي | Voice Unmuted')]
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`فشل العملية: ${err.message}`)], ephemeral: true });
    }
  }
};
