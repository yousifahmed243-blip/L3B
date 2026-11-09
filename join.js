const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('جعل البوت يدخل الروم الصوتي | Make the bot join a voice channel')
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('الروم الصوتي المراد دخوله (اختياري - افتراضياً رومك الحالي)')
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
        .setRequired(false))
    .addBooleanOption(opt =>
      opt.setName('mute')
        .setDescription('كتم المايك للحد من استهلاك النت (Self Mute)')
        .setRequired(false))
    .addBooleanOption(opt =>
      opt.setName('deaf')
        .setDescription('كتم الصوت (Self Deafen)')
        .setRequired(false)),

  async execute(interaction) {
    let targetChannel = interaction.options.getChannel('channel');
    const selfMute = interaction.options.getBoolean('mute') ?? true;
    const selfDeaf = interaction.options.getBoolean('deaf') ?? true;

    // If channel not provided, check the invoker's voice channel
    if (!targetChannel) {
      const member = interaction.member;
      if (!member || !member.voice.channel) {
        return interaction.reply({
          embeds: [errorEmbed('يجب أن تكون متواجداً في روم صوتي، أو حدد الروم في خيارات الأمر!')],
          ephemeral: true
        });
      }
      targetChannel = member.voice.channel;
    }

    // Check permissions to connect
    const permissions = targetChannel.permissionsFor(interaction.client.user);
    if (!permissions || !permissions.has(PermissionFlagsBits.Connect)) {
      return interaction.reply({
        embeds: [errorEmbed('لا أملك صلاحية الدخول (Connect) إلى هذا الروم الصوتي!')],
        ephemeral: true
      });
    }

    try {
      const connection = joinVoiceChannel({
        channelId: targetChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf,
        selfMute,
      });

      await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

      await interaction.reply({
        embeds: [
          successEmbed(
            `🎙️ تم دخول الروم الصوتي بنجاح: <#${targetChannel.id}>\n\n• كتم الصوت (Deafened): **${selfDeaf ? 'مفعل ✅' : 'معطل ❌'}**\n• كتم المايك (Muted): **${selfMute ? 'مفعل ✅' : 'معطل ❌'}**\n\nاستخدم أمر \`/leave\` لجعل البوت يغادر في أي وقت.`,
            'دخول الروم الصوتي | Voice Connected'
          )
        ]
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`فشل الاتصال بالروم الصوتي: ${err.message}`)],
        ephemeral: true
      });
    }
  }
};
