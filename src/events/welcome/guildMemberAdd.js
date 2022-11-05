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
    if (data.welcome.enabled === false || data.welcome.channel === null) return;

    const welcomeData = data.welcome.json.embed;

    const welcomeMessage = data.welcome.message
      ?.replace(/{userTag}/g, `${member.user.tag}`)
      .replace(/{userName}/g, `${member.user.username}`)
      .replace(/{userMention}/g, `<@${member.user.id}>`)
      .replace(/{guildName}/g, `${member.guild.name}`)
      .replace(/{memberCount}/g, `${member.guild.memberCount}`);

    const welcomeEmbed = new EmbedBuilder();

    if (welcomeData.color) welcomeEmbed.setColor(color);
    if (welcomeData.title) welcomeEmbed.setTitle(welcomeData.title);
    if (welcomeData.titleUrl) welcomeEmbed.setURL(welcomeData.titleUrl);

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
        iconURL: authorImgURL,
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
      welcomeEmbed.setFooter({ text: footer, iconURL: footerIcon });

    if (welcomeData.image?.url) welcomeEmbed.setImage(image);

    client.channels.cache
      .get(data.welcome.channel)
      .send({ content: welcomeMessage, embeds: [welcomeEmbed] });
  },
};
