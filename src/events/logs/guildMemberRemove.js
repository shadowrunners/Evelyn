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
    if (data.logs.enabled === false || data.logs.channel === "") return;
    if (member.user.bot) return;

    const logsChannel = client.channels.cache.get(data.logs?.channel);
    if (!logsChannel) return;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setTitle("Member Left")
      .addFields([
        {
          name: "🔹 | Member Name",
          value: `> ${member.user.tag}`,
          inline: true,
        },
        {
          name: "🔹 | Member ID",
          value: `> ${member.id}`,
          inline: true,
        },
        {
          name: "🔹 | Account Age",
          value: `> <t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
      ])
      .setFooter({ text: `${member.guild.name}` })
      .setTimestamp();
    return logsChannel.send({ embeds: [embed] });
  },
};
