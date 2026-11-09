const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('عرض معلومات المستخدم | Show user information')
    .addUserOption(opt => opt.setName('target').setDescription('المستخدم المراد عرض معلوماته').setRequired(false)),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target') || interaction.user;
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    const roles = member
      ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => `<@&${r.id}>`).join(' ') || 'لا توجد رتب'
      : 'غير متواجد بالسيرفر';

    await interaction.reply({
      embeds: [createEmbed({
        title: `👤 معلومات المستخدم: ${targetUser.tag}`,
        fields: [
          { name: '🆔 المعرف', value: `\`${targetUser.id}\``, inline: true },
          { name: '🤖 هل هو بوت؟', value: targetUser.bot ? 'نعم' : 'لا', inline: true },
          { name: '📅 تاريخ إنشاء الحساب', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true },
          { name: '📥 تاريخ الانضمام للسيرفر', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'غير متوفر', inline: true },
          { name: '👑 الرتب', value: roles, inline: false },
        ],
        thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
        color: member ? member.displayHexColor : '#5865F2'
      })]
    });
  }
};
