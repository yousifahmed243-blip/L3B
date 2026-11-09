const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('إزالة الإسكات عن عضو | Unmute a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('العضو | Target member')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')], ephemeral: true });
    }

    try {
      await member.timeout(null, 'إزالة الإسكات بواسطة الإدارة');
      await interaction.reply({
        embeds: [successEmbed(`🔊 تم إلغاء إسكات **${targetUser.tag}** بنجاح.`, 'إلغاء الإسكات | Unmuted')]
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`فشل إلغاء الإسكات: ${err.message}`)], ephemeral: true });
    }
  }
};
