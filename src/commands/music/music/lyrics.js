const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const {
  checkVoice,
  isSongPlaying,
} = require("../../../functions/musicUtils.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();

module.exports = {
  subCommand: "music.lyrics",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guildId } = interaction;

    const player = client.manager.players.get(guildId);
    await interaction.deferReply();

    if (!player) return;
    if (await checkVoice(interaction)) return;
    if (isSongPlaying(interaction, player)) return;

    const track = player.queue.current;

    const trackTitle = track.title.replace(
      /lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi
    );
    const actualTrack = await gClient.songs.search(trackTitle);
    const searches = actualTrack[0];
    const lyrics = await searches.lyrics();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setAuthor({
            name: `🔹 | Lyrics for ${trackTitle}`,
            url: searches.url,
          })
          .setDescription(lyrics)
          .setFooter({ text: "Lyrics are powered by Genius." })
          .setTimestamp(),
      ],
    });
  },
};
