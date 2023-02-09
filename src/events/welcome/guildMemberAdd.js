const { Client, GuildMember, EmbedBuilder, Constants } = require("discord.js");
const {
  replacePlaceholders,
} = require("../../functions/replacePlaceholders.js");
const { checkHex } = require("../../functions/checkHex.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const { guildId } = member;

    const data = await DB.findOne({
      id: guildId,
    });

    if (!data || !data.welcome.enabled || !data.welcome.channel || !data.welcome.embed) return;

    const welcomeChannel = client.channels.cache.get(data.welcome?.channel);
    if (!welcomeChannel) return;

    const embed = data.welcome.embed;
    const content = data.welcome.embed.messagecontent;

    const welcomeMessage = replacePlaceholders(content, member);
    const welcomeEmbed = new EmbedBuilder();

    if (embed.color) {
      const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
      if (hexCodeRegex.test(embed.color)) welcomeEmbed.setColor(embed.color);
    }

    if (embed.title) welcomeEmbed.setTitle(embed.title);

    if (embed.description) {
      const textEmbed = replacePlaceholders(embed.description, member);
      welcomeEmbed.setDescription(textEmbed);
    }

    if (embed.author) {
      const authorName = replacePlaceholders(embed.author.name, member);

      welcomeEmbed.setAuthor({
        name: authorName,
        iconURL: embed.author.icon_url
      });
    }

    if (embed.footer) {
      const footerData = replacePlaceholders(embed.footer.text, member);

      welcomeEmbed.setFooter({
        text: footerData,
        iconURL: embed.footer.icon_url,
      });
    };

    if (embed.image?.url) welcomeEmbed.setImage(embed.image?.url);
    if (embed.thumbnail?.url) welcomeEmbed.setThumbnail(embed.thumbnail?.url);

    if (content) {
      welcomeChannel.send({
        content: welcomeMessage,
        embeds: [welcomeEmbed],
      });
    } else {
      welcomeChannel.send({
        embeds: [welcomeEmbed],
      });
    }
  },
};
