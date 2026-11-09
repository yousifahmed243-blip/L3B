const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('عرض معلومات السيرفر | Show server information'),

  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    const channels = guild.channels.cache;
    const textCount = channels.filter(c => c.type === 0).size;
    const voiceCount = channels.filter(c => c.type === 2).size;
    const categoryCount = channels.filter(c => c.type === 4).size;

    await interaction.reply({
      embeds: [createEmbed({
        title: `🏰 معلومات سيرفر: ${guild.name}`,
        fields: [
          { name: '👑 المالك', value: `<@${owner.id}> (${owner.user.tag})`, inline: true },
          { name: '🆔 معرف السيرفر', value: `\`${guild.id}\``, inline: true },
          { name: '📅 تاريخ التأسيس', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
          { name: '👥 إجمالي الأعضاء', value: guild.memberCount.toString(), inline: true },
          { name: '📁 القنوات والرومات', value: `💬 ${textCount} كتابي | 🔊 ${voiceCount} صوتي | 📂 ${categoryCount} فئة`, inline: true },
          { name: '🛡️ عدد الرتب', value: guild.roles.cache.size.toString(), inline: true },
          { name: '✨ مستوى التعزيز (Boost)', value: `المستوى ${guild.premiumTier} (${guild.premiumSubscriptionCount || 0} بوست)`, inline: true },
        ],
        thumbnail: guild.iconURL({ dynamic: true }),
        color: '#5865F2'
      })]
    });
  }
};
