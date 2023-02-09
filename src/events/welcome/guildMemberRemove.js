const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const { replacePlaceholders } = require("../../functions/replacePlaceholders.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildMemberRemove",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const { guildId } = member;

    const data = await DB.findOne({
      id: guildId,
    });

    if (!data || !data.goodbye.enabled || !data.goodbye.channel || !data.goodbye.embed) return;

    const goodbyeChannel = client.channels.cache.get(data.goodbye?.channel);
    if (!goodbyeChannel) return;

    const embed = data.goodbye.embed;
    const content = data.goodbye.embed.messagecontent;

    const goodbyeMessage = replacePlaceholders(content, member);
    const goodbyeEmbed = new EmbedBuilder();

    if (embed.color) {
      const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
      if (hexCodeRegex.test(embed.color)) goodbyeEmbed.setColor(embed.color);
    };

    if (embed.title) goodbyeEmbed.setTitle(embed.title);

    if (embed.description) {
      const textEmbed = replacePlaceholders(embed.description, member);
      goodbyeEmbed.setDescription(textEmbed);
    };

    if (embed.author) {
      const authorName = replacePlaceholders(embed.author.name, member);

      goodbyeEmbed.setAuthor({
        name: authorName,
        iconURL: embed.author.icon_url
      });
    };

    if (embed.footer) {
      const footerData = replacePlaceholders(embed.footer.text, member);

      goodbyeEmbed.setFooter({
        text: footerData,
        iconURL: embed.footer.icon_url,
      });
    };

    if (embed.image?.url) goodbyeEmbed.setImage(embed.image?.url);
    if (embed.thumbnail?.url) goodbyeEmbed.setThumbnail(embed.thumbnail?.url);

    if (content) {
      goodbyeChannel.send({
        content: goodbyeMessage,
        embeds: [goodbyeEmbed],
      });
    } else {
      goodbyeChannel.send({
        embeds: [goodbyeEmbed],
      });
    };
  },
};
