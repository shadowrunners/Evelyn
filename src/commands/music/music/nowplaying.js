const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const {
  checkVoice,
  isSongPlaying,
  progressbar,
} = require("../../../functions/musicUtils.js");
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
    await interaction.deferReply();

    if (!player) return;
    if (await checkVoice(interaction)) return;
    if (isSongPlaying(interaction, player)) return;

    const track = player.queue.current;

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setAuthor({
            name: "Now Playing",
            iconURL: member.user.avatarURL({ dynamic: true }),
          })
          .setDescription(
            `**[${track.title}](${track.uri})** [${track.requester}]
                
                \`${pms(player.shoukaku.position)}\` [${progressbar(
              player
            )}] \`${pms(track.length)}\`
              `
          )
          .setTimestamp(),
      ],
    });
  },
};
