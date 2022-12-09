const { Client, GuildMember, EmbedBuilder } = require("discord.js");
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

    if (!data) return;
    if (data.welcome.enabled === false || data.welcome.channel === "") return;

    const welcomeChannel = client.channels.cache.get(data.welcome?.channel);
    if (!welcomeChannel) return;

    const welcomeData = data.welcome.json.embed;

    const welcomeMessage = data.welcome.message.json.content
      ?.replace(/{userTag}/g, `${member.user.tag}`)
      .replace(/{userName}/g, `${member.user.username}`)
      .replace(/{userMention}/g, `<@${member.user.id}>`)
      .replace(/{guildName}/g, `${member.guild.name}`)
      .replace(/{memberCount}/g, `${member.guild.memberCount}`);

    const welcomeEmbed = new EmbedBuilder();

    if (welcomeData.color) welcomeEmbed.setColor(welcomeData.color);
    if (welcomeData.title) welcomeEmbed.setTitle(welcomeData.title);

    if (welcomeData.description) {
      const textEmbed = welcomeData.description
        .replace(/{userTag}/g, `${member.user.tag}`)
        .replace(/{userName}/g, `${member.user.username}`)
        .replace(/{userID}/g, `${member.id}`)
        .replace(/{userMention}/g, `<@${member.user.id}>`)
        .replace(/{guildName}/g, `${member.guild.name}`)
        .replace(/{memberCount}/g, `${member.guild.memberCount}`);
      welcomeEmbed.setDescription(textEmbed);
    }

    if (welcomeData.author?.name) {
      const authorName = welcomeData.author.name
        .replace(/{userTag}/g, `${member.user.tag}`)
        .replace(/{userName}/g, `${member.user.username}`)
        .replace(/{userID}/g, `${member.id}`)
        .replace(/{guildName}/g, `${member.guild.name}`)
        .replace(/{memberCount}/g, `${member.guild.memberCount}`);
      welcomeEmbed.setAuthor(authorName);
    }

    if (welcomeData.author?.icon_url)
      welcomeEmbed.setAuthor({
        name: welcomeData.author.name,
        iconURL: welcomeData.author.icon_url,
      });

    if (welcomeData.footer?.text) {
      const footerData = welcomeData.footer?.text
        .replace(/{userTag}/g, `${member.user.tag}`)
        .replace(/{userName}/g, `${member.user.username}`)
        .replace(/{userID}/g, `${member.id}`)
        .replace(/{guildName}/g, `${member.guild.name}`)
        .replace(/{guildID}/g, `${member.guild.id}`)
        .replace(/{memberCount}/g, `${member.guild.memberCount}`);
      welcomeEmbed.setFooter({ text: footerData });
    }

    if (welcomeData.footer && welcomeData.footer.icon_url)
      welcomeEmbed.setFooter({
        text: welcomeData.footer,
        iconURL: welcomeData.footer.icon_url,
      });

    if (welcomeData.image?.url) welcomeEmbed.setImage(welcomeData.image?.url);

    return welcomeChannel.send({
      content: welcomeMessage,
      embeds: [welcomeEmbed],
    });
  },
};
