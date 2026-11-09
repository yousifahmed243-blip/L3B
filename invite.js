const { SlashCommandBuilder, OAuth2Scopes, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('رابط دعوة البوت | Bot invite link'),

  async execute(interaction, client) {
    const inviteUrl = client.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: [PermissionFlagsBits.Administrator]
    });

    await interaction.reply({
      embeds: [createEmbed({
        title: '🔗 رابط دعوة البوت | Bot Invite',
        description: `[اضغط هنا لإضافة البوت إلى سيرفرك](${inviteUrl})\n\nشكراً لاستخدامك نظام الحماية والأدوات!`,
        color: '#5865F2'
      })]
    });
  }
};
