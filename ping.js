const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('عرض سرعة استجابة البوت | Show bot latency'),

  async execute(interaction, client) {
    const sent = await interaction.deferReply({ fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsPing = client.ws.ping;

    await interaction.editReply({
      embeds: [createEmbed({
        title: '🏓 بونج! سرعة الاستجابة | Pong!',
        fields: [
          { name: '🤖 استجابة البوت (Latency)', value: `\`${latency}ms\``, inline: true },
          { name: '🌐 اتصال الديسكورد (WebSocket)', value: `\`${wsPing}ms\``, inline: true },
        ],
        color: latency < 200 ? '#57F287' : '#FEE75C'
      })]
    });
  }
};
