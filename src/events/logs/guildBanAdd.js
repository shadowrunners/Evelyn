const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildBanAdd",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const data = await DB.findOne({
      id: member.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled === false || data.logs.channel === null) return;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL() })
      .setTitle("Member Banned")
      .addFields([
        {
          name: "🔹 | Member Name",
          value: `> ${member.user.username}`,
          inline: true,
        },
        {
          name: "🔹 | ID",
          value: `> ${member.user.id}`,
          inline: true,
        },
      ])
      .setTimestamp();

    return client.channels.cache
      .get(data.logs?.channel)
      .send({ embeds: [embed] });
  },
};
