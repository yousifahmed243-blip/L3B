const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hide')
    .setDescription('إخفاء القناة الحالية عن الجميع | Hide current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      ViewChannel: false
    });

    await interaction.reply({
      embeds: [successEmbed(`👁️‍🗨️ تم إخفاء القناة <#${interaction.channel.id}> عن رتبة Everyone.`, 'إخفاء القناة | Channel Hidden')]
    });
  }
};
