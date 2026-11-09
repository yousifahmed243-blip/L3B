const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delivery')
    .setDescription('إرسال رسالة تسليم طلب جديد | Send product delivery message')
    .addUserOption(opt => opt.setName('buyer').setDescription('المشتري').setRequired(true))
    .addStringOption(opt => opt.setName('product').setDescription('اسم المنتج أو الحساب').setRequired(true))
    .addStringOption(opt => opt.setName('details').setDescription('تفاصيل المنتج أو الملاحظات').setRequired(false))
    .addStringOption(opt => opt.setName('price').setDescription('السعر المدفوع').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const buyer = interaction.options.getUser('buyer');
    const product = interaction.options.getString('product');
    const details = interaction.options.getString('details') || 'تم استلام الطلب بالكامل ومطابق للشروط.';
    const price = interaction.options.getString('price') || 'مدفوع';

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const embed = createEmbed({
      title: '📦 إشعار تسليم طلب جديد | Order Delivered',
      description: `شكراً لثقتك بنا <@${buyer.id}>! تم إكمال طلبك وتسليمه بنجاح.`,
      fields: [
        { name: '👤 المشتري', value: `<@${buyer.id}> (${buyer.tag})`, inline: true },
        { name: '🏷️ المنتج', value: product, inline: true },
        { name: '💰 السعر', value: price, inline: true },
        { name: '🧾 رقم الطلب', value: `\`${orderId}\``, inline: true },
        { name: '🛡️ الضمان والدعم', value: 'ضمان تشغيل كامل ودعم فني متاح 24/7', inline: true },
        { name: '📝 ملاحظات التسليم', value: details, inline: false },
      ],
      color: '#57F287',
      thumbnail: buyer.displayAvatarURL(),
      footer: { text: 'نتمنى لك تجربة ممتعة! لا تنسَ مشاركتنا رأيك عبر أمر /review' }
    });

    await interaction.reply({
      content: `🎉 ألف مبروك <@${buyer.id}>! تم تسليم طلبك بنجاح.`,
      embeds: [embed]
    });
  }
};
