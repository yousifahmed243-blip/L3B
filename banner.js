const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('عرض بنر العضو | Show user banner')
    .addUserOption(opt => opt.setName('target').setDescription('العضو').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;
    const fetchedUser = await user.fetch({ force: true });
    const bannerUrl = fetchedUser.bannerURL({ size: 1024, dynamic: true });

    if (!bannerUrl) {
      return interaction.reply({
        embeds: [createEmbed({
          title: `🎨 بنر: ${user.tag}`,
          description: 'هذا المستخدم لا يملك بنر مخصص (قد يكون لديه لون فقط).',
          color: fetchedUser.accentColor || '#5865F2'
        })]
      });
    }

    await interaction.reply({
      embeds: [createEmbed({
        title: `🎨 بنر: ${user.tag}`,
        description: `[رابط البنر المباشر](${bannerUrl})`,
        image: bannerUrl,
        color: '#5865F2'
      })]
    });
  }
};
