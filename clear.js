const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('حذف عدد محدد من الرسائل | Delete a specified number of messages')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('عدد الرسائل (من 1 إلى 100) | Number of messages (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        embeds: [successEmbed(`🧹 تم حذف **${deleted.size}** رسالة بنجاح.`, 'تنظيف الرسائل | Messages Cleared')],
        ephemeral: true
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`فشل حذف الرسائل (قد تكون أقدم من 14 يوماً): ${err.message}`)],
        ephemeral: true
      });
    }
  }
};
