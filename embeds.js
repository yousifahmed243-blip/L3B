const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

function createEmbed({ title, description, color, fields = [], thumbnail, image, author, footer }) {
  const embed = new EmbedBuilder()
    .setColor(color || config.defaultColor)
    .setTimestamp();

  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);

  if (fields && fields.length > 0) {
    embed.addFields(fields);
  }

  if (author) {
    embed.setAuthor(author);
  }

  if (footer) {
    embed.setFooter(footer);
  } else {
    embed.setFooter({ text: config.footerText });
  }

  return embed;
}

function successEmbed(message, title = '✅ تم بنجاح | Success') {
  return createEmbed({
    title,
    description: message,
    color: config.successColor
  });
}

function errorEmbed(message, title = '❌ خطأ | Error') {
  return createEmbed({
    title,
    description: message,
    color: config.errorColor
  });
}

function warningEmbed(message, title = '⚠️ تنبيه | Warning') {
  return createEmbed({
    title,
    description: message,
    color: config.warningColor
  });
}

module.exports = {
  createEmbed,
  successEmbed,
  errorEmbed,
  warningEmbed
};
