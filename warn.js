const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('تحذير عضو | Warn a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('العضو المراد تحذيره | Target user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب التحذير | Warning reason')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');

    const warningObj = {
      id: Date.now().toString(),
      reason,
      moderator: interaction.user.tag,
      timestamp: new Date().toISOString()
    };

    db.push(`warnings.${interaction.guild.id}.${targetUser.id}`, warningObj);
    const allWarns = db.get(`warnings.${interaction.guild.id}.${targetUser.id}`, []);

    await interaction.reply({
      embeds: [
        successEmbed(
          `⚠️ تم تحذير العضو **${targetUser.tag}** بنجاح.\n**السبب:** ${reason}\n**إجمالي التحذيرات:** ${allWarns.length}`,
          'تحذير عضو | User Warned'
        )
      ]
    });
  }
};
