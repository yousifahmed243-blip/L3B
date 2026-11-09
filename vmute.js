const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vmute')
    .setDescription('إسكات عضو في الكول | Voice mute a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('العضو في الروم الصوتي | Target voice member')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب الإسكات الصوتي | Reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'إسكات صوتي | Server Voice Mute';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member || !member.voice.channel) {
      return interaction.reply({ embeds: [errorEmbed('العضو ليس متواجداً في أي روم صوتي!')], ephemeral: true });
    }

    try {
      await member.voice.setMute(true, reason);
      await interaction.reply({
        embeds: [successEmbed(`🔇 تم إسكات **${targetUser.tag}** صوتياً في الروم **${member.voice.channel.name}**.\n**السبب:** ${reason}`, 'إسكات صوتي | Voice Muted')]
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`فشل الإسكات الصوتي: ${err.message}`)], ephemeral: true });
    }
  }
};
