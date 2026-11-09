const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setreviewchannel')
    .setDescription('تعيين قناة عرض التقييمات | Set dedicated review channel')
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('القناة المخصصة للتقييمات | Review channel')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    db.set(`settings.reviewChannels.${interaction.guild.id}`, channel.id);

    await interaction.reply({
      embeds: [successEmbed(`⭐ تم تعيين قناة التقييمات بنجاح إلى: <#${channel.id}>.\nكل تقييم جديد سيتم إرساله هناك تلقائياً.`, 'قناة التقييمات | Review Channel Set')]
    });
  }
};
