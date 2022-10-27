const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");
const {
  createPlaylist,
  deletePlaylist,
  addCurrent,
  showPlaylistTracks,
  showAllPlaylists,
  setVolume,
  seek,
} = require("../../engines/PLEngine.js");

module.exports = {
  botPermissions: ["SendMessages", "EmbedLinks", "Connect", "Speak"],
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("So.. playlists?")
    .addSubcommand((options) =>
      options
        .setName("create")
        .setDescription("Create a new playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name for the playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("delete")
        .setDescription("Delete your saved playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name of the playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("addcurrent")
        .setDescription("Add the currently playing song to the playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name of the playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("info")
        .setDescription("Lists the tracks of the provided playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name of the playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options.setName("list").setDescription("Lists all your playlists.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guildId } = interaction;
    const player = client.manager.players.get(guildId);

    await interaction.deferReply();

    let pName;
    let data;
    let songs;
    let embeds;

    try {
      switch (options.getSubcommand()) {
        case "create":
          pName = options.getString("name");
          return createPlaylist(interaction, pName);

        case "delete":
          pName = options.getString("name");
          return deletePlaylist(interaction, pName);

        case "addcurrent":
          pName = options.getString("name");
          return addCurrent(interaction, player, pName);

        case "info":
          pName = options.getString("name");
          return showPlaylistTracks(client, interaction, pName);

        case "list":
          return showAllPlaylists(client, interaction);

        case "settings":
          const track = player.queue.current;

          switch (options.getString("options")) {
            case "skip":
              if (
                isSongPlaying(interaction, player) ||
                checkForQueue(interaction, player)
              )
                return;

              player.skip();

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
                      `**[${track.title}](${track.uri})** [${track.requester}]
                        
                        \`${pms(player.shoukaku.position)}\` ${progressbar(
                        player
                      )} \`${pms(track.length)}\`
                      `
                    ),
                ],
              });

            case "pause":
              if (isSongPlaying(interaction, player)) return;

              player.pause(true);

              return interaction.editReply({
                embeds: [embed.setDescription("🔹 | Paused.")],
              });

            case "resume":
              player.pause(false);

              return interaction.editReply({
                embeds: [embed.setDescription("🔹 | Resumed.")],
              });

            case "stop":
              player.destroy();

              return interaction.editReply({
                embeds: [new EmbedBuilder().setDescription("🔹 | Stopped.")],
              });

            case "lyrics":
              if (isSongPlaying(interaction, player)) return;

              const trackTitle = track.title.replace(
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

              player.queue.shuffle();

              return interaction.editReply({
                embeds: [embed.setDescription("🔹 | Shuffled.")],
              });

            case "queue":
              if (checkForQueue(interaction, player)) return;

              songs = [];
              embeds = [];

              for (let i = 0; i < player.queue.length; i++) {
                songs.push(
                  `${i + 1}. [${player.queue[i].title}](${
                    player.queue[i].uri
                  }) [${player.queue[i].requester}]`
                );
              }

              for (let i = 0; i < songs.length; i += 10) {
                embed
                  .setAuthor({ name: `Current queue for ${guild.name}` })
                  .setTitle(
                    `▶️ | Currently playing: ${player.queue.current.title}`
                  )
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
      }
    } catch (e) {
      console.log(e);
    }
  },
};
