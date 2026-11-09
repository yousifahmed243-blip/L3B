const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('تحديد وضع التباطؤ للقناة | Set slowmode for the channel')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('عدد الثواني (0 لإلغاء التباطؤ) | Slowmode seconds (0 to disable)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);

    const msg = seconds === 0
      ? '⚡ تم تعطيل التباطؤ في هذه القناة.'
      : `⏱️ تم تعيين التباطؤ في هذه القناة إلى **${seconds}** ثانية.`;

    await interaction.reply({
      embeds: [successEmbed(msg, 'وضع التباطؤ | Slowmode Updated')]
    });
  }
};
