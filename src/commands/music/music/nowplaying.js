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

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: "Now Playing",
            iconURL: member.user.avatarURL({ dynamic: true }),
          })
          .setDescription(
            `**[${track.info.title}](${track.info.uri})** [${
              track.info.requester
            }]
                
                [\`${pms(player.position)}\` [${progressbar(player)} \`${pms(
              track.info.length
            )}\`
              `
          ),
      ],
    });
  },
};
