const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const { createEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('إرسال رسالة التقييم | Send a customer review')
    .addIntegerOption(opt =>
      opt.setName('rating')
        .setDescription('التقييم من 1 إلى 5 نجوم')
        .setRequired(true)
        .addChoices(
          { name: '⭐⭐⭐⭐⭐ (5 نجوم)', value: 5 },
          { name: '⭐⭐⭐⭐ (4 نجوم)', value: 4 },
          { name: '⭐⭐⭐ (3 نجوم)', value: 3 },
          { name: '⭐⭐ (نجمتان)', value: 2 },
          { name: '⭐ (نجمة واحدة)', value: 1 },
        ))
    .addStringOption(opt =>
      opt.setName('comment')
        .setDescription('رأيك وتجربتك')
        .setRequired(true)),

  async execute(interaction) {
    const rating = interaction.options.getInteger('rating');
    const comment = interaction.options.getString('comment');

    const stars = '⭐'.repeat(rating);
    const reviewEmbed = createEmbed({
      title: '⭐ تقييم عميل جديد | Customer Review',
      description: comment,
      fields: [
        { name: 'العميل', value: `<@${interaction.user.id}> (${interaction.user.tag})`, inline: true },
        { name: 'التقييم', value: `${stars} (${rating}/5)`, inline: true }
      ],
      color: '#FEE75C',
      thumbnail: interaction.user.displayAvatarURL(),
      footer: { text: `شكراً لمشاركتك رأيك معنا • ${interaction.guild.name}` }
    });

    const targetChannelId = db.get(`settings.reviewChannels.${interaction.guild.id}`);
    if (targetChannelId) {
      const channel = await interaction.guild.channels.fetch(targetChannelId).catch(() => null);
      if (channel) {
        await channel.send({ embeds: [reviewEmbed] });
        return interaction.reply({ content: '✅ شكراً جزيلاً لتقييمك! تم نشر تقييمك في روم التقييمات.', ephemeral: true });
      }
    }

    // Default reply in current channel if review channel not set
    await interaction.reply({ embeds: [reviewEmbed] });
  }
};
