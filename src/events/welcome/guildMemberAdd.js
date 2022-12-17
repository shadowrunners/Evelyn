const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const {
  replacePlaceholders,
} = require("../../functions/replacePlaceholders.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const data = await DB.findOne({
      id: member.guild.id,
    });

    if (!data || !data.welcome.enabled || !data.welcome.channel) return;

    const welcomeChannel = client.channels.cache.get(data.welcome.channel);
    if (!welcomeChannel) return;

    const { embed } = data.welcome.json;

    const welcomeMessage = replacePlaceholders(embed.content, member);
    const welcomeEmbed = new EmbedBuilder();

    if (embed.color) welcomeEmbed.setColor(embed.color);
    if (embed.title) welcomeEmbed.setTitle(embed.title);

    if (embed.description) {
      const textEmbed = replacePlaceholders(embed.description, member);
      welcomeEmbed.setDescription(textEmbed);
    }

    if (embed.author?.name) {
      const authorName = replacePlaceholders(embed.author.name, member);
      welcomeEmbed.setAuthor(authorName);
    }

    if (embed.author?.icon_url)
      welcomeEmbed.setAuthor({
        name: embed.author.name,
        iconURL: embed.author.icon_url,
      });

    if (embed.footer?.text) {
      const footerData = replacePlaceholders(embed.footer.text, member);
      welcomeEmbed.setFooter({ text: footerData });
    }

    if (embed.footer && embed.footer.icon_url)
      welcomeEmbed.setFooter({
        text: embed.footer,
        iconURL: embed.footer.icon_url,
      });

    if (embed.image?.url) welcomeEmbed.setImage(welcomeData.image?.url);
    if (embed.thumbnail?.url) welcomeEmbed.setThumbnail(embed.thumbnail.url);

    return welcomeChannel.send({
      content: welcomeMessage,
      embeds: [welcomeEmbed],
    });
  },
};
