const { Client, GuildMember, EmbedBuilder } = require("discord.js");
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

    if (!data) return;
    if (data.goodbye.enabled === false || data.goodbye.channel === "") return;

    const goodbyeChannel = client.channels.cache.get(data.goodbye?.channel);
    if (!goodbyeChannel) return;

    const goodbyeData = data.goodbye.json.embed;

    const goodbyeMessage = data.goodbye.message
      ?.replace(/{userTag}/g, `${member.user.tag}`)
      .replace(/{userName}/g, `${member.user.username}`)
      .replace(/{userMention}/g, `<@${member.user.id}>`)
      .replace(/{guildName}/g, `${member.guild.name}`)
      .replace(/{memberCount}/g, `${member.guild.memberCount}`);

    const goodbyeEmbed = new EmbedBuilder();

    if (goodbyeData.color) goodbyeEmbed.setColor(color);
    if (goodbyeData.title) goodbyeEmbed.setTitle(goodbyeData.title);
    if (goodbyeData.titleUrl) goodbyeEmbed.setURL(goodbyeData.titleUrl);

    if (goodbyeData.description) {
      const textEmbed = goodbyeData.description
        ?.replace(/{userTag}/g, `${member.user.tag}`)
        .replace(/{userName}/g, `${member.user.username}`)
        .replace(/{userMention}/g, `<@${member.user.id}>`)
        .replace(/{userID}/g, `${member.id}`)
        .replace(/{guildName}/g, `${member.guild.name}`)
        .replace(/{memberCount}/g, `${member.guild.memberCount}`);
      goodbyeEmbed.setDescription(textEmbed);
    }

    if (goodbyeData.author?.name) {
      const authorName = goodbyeData.author.name
        .replace(/{userName}/g, `${member.user.username}`)
        .replace(/{userID}/g, `${member.id}`)
        .replace(/{guildName}/g, `${member.guild.name}`)
        .replace(/{memberCount}/g, `${member.guild.memberCount}`);
      goodbyeEmbed.setAuthor(authorName);
    }

    if (goodbyeData.footer?.text) {
      const footerData = goodbyeData.footer?.text
        .replace(/{userTag}/g, `${member.user.tag}`)
        .replace(/{userName}/g, `${member.user.username}`)
        .replace(/{userID}/g, `${member.id}`)
        .replace(/{guildName}/g, `${member.guild.name}`)
        .replace(/{memberCount}/g, `${member.guild.memberCount}`);
      goodbyeEmbed.setFooter({ text: footerData });
    }

    if (goodbyeData.footer && goodbyeData.footer?.icon_url)
      goodbyeEmbed.setFooter({ text: footer, iconURL: footerIcon });

    if (goodbyeData.image?.url) goodbyeEmbed.setImage(image);

    return goodbyeChannel.send({
      content: goodbyeMessage,
      embeds: [goodbyeEmbed],
    });
  },
};
