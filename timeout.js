const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

const durationMap = {
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '10m': 10 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('إسكات عضو لفترة محددة | Timeout a user for a specific duration')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('العضو | Target user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('المدة | Duration')
        .setRequired(true)
        .addChoices(
          { name: '1 دقيقة (1 Minute)', value: '1m' },
          { name: '5 دقائق (5 Minutes)', value: '5m' },
          { name: '10 دقائق (10 Minutes)', value: '10m' },
          { name: '1 ساعة (1 Hour)', value: '1h' },
          { name: '1 يوم (1 Day)', value: '1d' },
          { name: '7 أيام (7 Days)', value: '7d' },
        ))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('السبب | Reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const durCode = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'إسكات مؤقت | Temporary Timeout';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) {
      return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')], ephemeral: true });
    }

    const durationMs = durationMap[durCode] || (5 * 60 * 1000);

    try {
      await member.timeout(durationMs, reason);
      await interaction.reply({
        embeds: [successEmbed(`⏳ تم إعطاء تايم آوت لـ **${targetUser.tag}** لمدة **${durCode}**.\n**السبب:** ${reason}`, 'تايم آوت | Member Timeout')]
      });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`فشل تنفيذ التايم آوت: ${err.message}`)], ephemeral: true });
    }
  }
};
