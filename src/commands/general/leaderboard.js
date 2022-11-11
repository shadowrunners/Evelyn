const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");
const DXP = require("discord-xp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Lists the top users when it comes to XP."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const fetchLB = await DXP.fetchLeaderboard(interaction.guild.id, 10);
    const leaderboard = await DXP.computeLeaderboard(client, fetchLB);
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    const mappedLB = leaderboard.map(
      (lb) =>
        `**#${lb.position}** • **<@${lb.userID}>** • Level: \`${
          lb.level
        }\` • XP: \`${lb.xp - DXP.xpFor(lb.level)}/${
          DXP.xpFor(lb.level + 1) - DXP.xpFor(lb.level)
        }\``
    );

    return interaction.reply({
      embeds: [
        embed
          .setTitle(`Leaderboard for ${interaction.guild.name}`)
          .setDescription(
            `${mappedLB.join("\n\n")}` ||
              `This leaderboard is empty as there is currently no data to compute the leaderboard.`
          ),
      ],
    });
  },
};
