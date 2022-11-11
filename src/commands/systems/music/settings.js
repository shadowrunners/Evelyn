const { ChatInputCommandInteraction, Client } = require("discord.js");
const {
  isSongPlaying,
  checkForQueue,
  checkVoice,
} = require("../../../engines/AMEngine.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();
const { embedPages } = require("../../../utils/utils.js");
const pms = require("pretty-ms");

module.exports = {
  subCommand: "music.settings",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guildId } = interaction;

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    const player = client.manager.players.get(guildId);
    await interaction.deferReply();

    if (!player) return;
    if (await checkVoice(interaction)) return;

    const track = player.currentTrack;

    switch (options.getString("options")) {
      case "skip":
        if (
          isSongPlaying(interaction, player) ||
          checkForQueue(interaction, player)
        )
          return;

        await player.stop();

        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Skipped.")],
        });

      case "nowplaying":
        if (isSongPlaying(interaction, player)) return;

        return interaction.editReply({
          embeds: [
            embed
              .setAuthor({
                name: "Now Playing",
                iconURL: member.user.avatarURL({ dynamic: true }),
              })
              .setDescription(
                `**[${track.info.title}](${track.info.uri})** [${
                  track.info.requester
                }]
                    
                    [\`${pms(player.position)}\` [${progressbar(
                  player
                )} \`${pms(track.info.length)}\`
                  `
              ),
          ],
        });

      case "pause":
        if (isSongPlaying(interaction, player)) return;

        await player.pause(true);

        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Paused.")],
        });

      case "resume":
        await player.pause(false);

        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Resumed.")],
        });

      case "stop":
        await player.destroy();

        return interaction.editReply({
          embeds: [new EmbedBuilder().setDescription("🔹 | Stopped.")],
        });

      case "lyrics":
        if (isSongPlaying(interaction, player)) return;

        const trackTitle = track.info.title.replace(
          /lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi
        );
        const actualTrack = await gClient.songs.search(trackTitle);
        const searches = actualTrack[0];
        const lyrics = await searches.lyrics();

        return interaction.editReply({
          embeds: [
            embed
              .setAuthor({
                name: `🔹 | Lyrics for ${trackTitle}`,
                url: searches.url,
              })
              .setDescription(lyrics)
              .setFooter({ text: "Lyrics are powered by Genius." }),
          ],
        });

      case "shuffle":
        if (
          isSongPlaying(interaction, player) ||
          checkForQueue(interaction, player)
        )
          return;

        await player.queue.shuffle();

        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Shuffled.")],
        });

      case "queue":
        if (checkForQueue(interaction, player)) return;

        const songs = [];
        const embeds = [];

        for (let i = 0; i < player.queue.length; i++) {
          songs.push(
            `${i + 1}. [${player.queue[i].title}](${player.queue[i].uri}) [${
              player.queue[i].requester
            }]`
          );
        }

        for (let i = 0; i < songs.length; i += 10) {
          embed
            .setAuthor({ name: `Current queue for ${guild.name}` })
            .setTitle(`▶️ | Currently playing: ${player.queue.current.title}`)
            .setDescription(songs.slice(i, i + 10).join("\n"));
          embeds.push(embed);
        }

        return await embedPages(client, interaction, embeds);

      case "queueclear":
        if (checkForQueue(interaction, player)) return;

        player.queue.clear();

        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Queue cleared.")],
        });
    }
  },
};
