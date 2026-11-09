const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('مسح جميع رسائل القناة عن طريق إعادة إنشائها | Clear all messages by recreating channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;
    const position = channel.position;
    const parent = channel.parentId;

    const cloned = await channel.clone({
      name: channel.name,
      permissionOverwrites: channel.permissionOverwrites.cache,
      topic: channel.topic,
      nsfw: channel.nsfw,
      parent,
      position
    });

    await channel.delete('قناة تم عمل Nuke لها');

    await cloned.send({
      embeds: [
        createEmbed({
          title: '💥 تمت إعادة إنشاء القناة بنجاح | Channel Nuked',
          description: `تم مسح كافة الرسائل بواسطة **${interaction.user.tag}**`,
          color: '#5865F2',
          image: 'https://media.giphy.com/media/oe33xf3B50fsc/giphy.gif'
        })
      ]
    });
  }
};
