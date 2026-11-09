const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('عرض صورة العضو | Show user avatar')
    .addUserOption(opt => opt.setName('target').setDescription('العضو | Target user').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;
    const avatarUrl = user.displayAvatarURL({ size: 1024, dynamic: true });

    await interaction.reply({
      embeds: [createEmbed({
        title: `🖼️ صورة: ${user.tag}`,
        description: `[رابط الصورة المباشر](${avatarUrl})`,
        image: avatarUrl,
        color: '#5865F2'
      })]
    });
  }
};
