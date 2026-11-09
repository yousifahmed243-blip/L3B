const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('فتح القناة الحالية | Unlock the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: null
    });

    await interaction.reply({
      embeds: [successEmbed(`🔓 تم فتح القناة <#${interaction.channel.id}> وأصبح بإمكان الجميع الكتابة مجدداً.`, 'فتح القناة | Channel Unlocked')]
    });
  }
};
