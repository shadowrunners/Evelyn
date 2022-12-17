const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const {
  replacePlaceholders,
} = require("../../functions/replacePlaceholders.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildMemberRemove",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const data = await DB.findOne({
      id: member.guild.id,
    });

    if (!data || !data.goodbye.enabled || !data.goodbye.channel) return;

    const goodbyeChannel = client.channels.cache.get(data.goodbye?.channel);
    if (!goodbyeChannel) return;

    const { embed } = data.goodbye.json.embed;
    const content = data.goodbye.json.content;

    const goodbyeMessage = replacePlaceholders(content, member);
    const goodbyeEmbed = new EmbedBuilder();

    if (embed.color) goodbyeEmbed.setColor(embed.color);
    if (embed.title) goodbyeEmbed.setTitle(embed.title);

    if (embed.description) {
      const textEmbed = replacePlaceholders(embed.description, member);
      goodbyeEmbed.setDescription(textEmbed);
    }

    if (embed.author?.name) {
      const authorName = replacePlaceholders(embed.author.name, member);
      goodbyeEmbed.setAuthor(authorName);
    }

    if (embed.author?.icon_url)
      goodbyeEmbed.setAuthor({
        name: embed.author.name,
        iconURL: embed.author.icon_url,
      });

    if (embed.footer?.text) {
      const footerData = replacePlaceholders(embed.footer.text, member);
      goodbyeEmbed.setFooter({ text: footerData });
    }

    if (embed.footer && embed.footer?.icon_url)
      goodbyeEmbed.setFooter({
        text: embed.footer,
        iconURL: embed.footer?.icon_url,
      });

    if (embed.image?.url) goodbyeEmbed.setImage(embed.image?.url);
    if (embed.thumbnail?.url) goodbyeEmbed.setThumbnail(embed.thumbnail.url);

    goodbyeChannel.send({
      content: goodbyeMessage,
      embeds: [goodbyeEmbed],
    });
  },
};
