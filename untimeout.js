const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('إزالة الإسكات المؤقت عن عضو | Remove timeout from a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('العضو | Target member')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')], ephemeral: true });

    try {
      await member.timeout(null, 'إزالة التايم آوت');
      await interaction.reply({
        embeds: [successEmbed(`✨ تم إزالة التايم آوت عن **${targetUser.tag}** بنجاح.`, 'إلغاء التايم آوت | Untimeout')]
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`فشل العملية: ${err.message}`)], ephemeral: true });
    }
  }
};
