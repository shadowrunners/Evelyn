const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");
const pms = require("pretty-ms");

module.exports = {
  subCommand: "music.nowplaying",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { member, guildId } = interaction;
    const player = client.manager.players.get(guildId);
    const utils = new MusicUtils(interaction, player);
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    await interaction.deferReply();

    if (utils.check()) return;
    const track = player.queue.current;

    return interaction.editReply({
      embeds: [
        embed
          .setAuthor({
            name: "Now Playing",
            iconURL: member.user.avatarURL(),
          })
          .setDescription(
            `**[${track.title}](${track.uri})** [${track.requester}]
                
                \`${pms(player.shoukaku.position)}\` [${utils.progressbar(
              player
            )}] \`${pms(track.length)}\`
              `
          ),
      ],
    });
  },
};
