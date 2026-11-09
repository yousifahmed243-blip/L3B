const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unhide')
    .setDescription('إظهار القناة الحالية للجميع | Unhide current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      ViewChannel: null
    });

    await interaction.reply({
      embeds: [successEmbed(`👁️ تم إظهار القناة <#${interaction.channel.id}> للجميع مجدداً.`, 'إظهار القناة | Channel Unhidden')]
    });
  }
};
