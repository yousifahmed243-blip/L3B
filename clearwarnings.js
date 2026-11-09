const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear-warnings')
    .setDescription('مسح جميع تحذيرات عضو | Clear all warnings of a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('العضو المراد مسح تحذيراته | Target user')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    db.set(`warnings.${interaction.guild.id}.${targetUser.id}`, []);

    await interaction.reply({
      embeds: [successEmbed(`🧹 تم مسح كافة التحذيرات المسجلة بحق **${targetUser.tag}** بنجاح.`, 'مسح التحذيرات | Warnings Cleared')]
    });
  }
};
