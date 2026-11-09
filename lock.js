const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('قفل القناة الحالية | Lock the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });

    await interaction.reply({
      embeds: [successEmbed(`🔒 تم قفل القناة <#${interaction.channel.id}> بنجاح ومُنعت الرسائل عن الجميع.`, 'قفل القناة | Channel Locked')]
    });
  }
};
