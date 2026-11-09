const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('إرسال إعلان احترافي | Send an announcement to the channel')
    .addStringOption(opt => opt.setName('title').setDescription('عنوان الإعلان').setRequired(true))
    .addStringOption(opt => opt.setName('message').setDescription('نص الإعلان').setRequired(true))
    .addChannelOption(opt => opt.setName('channel').setDescription('القناة المراد الإرسال فيها').setRequired(false))
    .addRoleOption(opt => opt.setName('mention').setDescription('منشن رتبة مع الإعلان').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
    const mentionRole = interaction.options.getRole('mention');

    const embed = createEmbed({
      title: `📢 ${title}`,
      description: message,
      color: '#5865F2',
      author: {
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL()
      },
      footer: {
        text: `أعلن بواسطة ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      }
    });

    const content = mentionRole ? `<@&${mentionRole.id}>` : null;
    await targetChannel.send({ content, embeds: [embed] });

    await interaction.reply({ content: `✅ تم إرسال الإعلان إلى <#${targetChannel.id}> بنجاح!`, ephemeral: true });
  }
};
