const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");
const util = require("../../utils/util.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("A complete music system.")
    .addSubcommand((options) =>
      options
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Provide the name of the song or URL.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("volume")
        .setDescription("Alter the volume.")
        .addNumberOption((option) =>
          option
            .setName("percent")
            .setDescription("Provide the volume.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("repeat")
        .setDescription("Repeat the current song or queue.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Select the loop type.")
            .setRequired(true)
            .addChoices(
              { name: "🔹 | Queue", value: "queue" },
              { name: "🔹 | Song", value: "song" }
            )
        )
    )
    .addSubcommand((options) =>
      options
        .setName("settings")
        .setDescription("Select an option.")
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription("Select an option.")
            .setRequired(true)
            .addChoices(
              { name: "🔹 | View Queue", value: "queue" },
              { name: "🔹 | Skip", value: "skip" },
              { name: "🔹 | Pause", value: "pause" },
              { name: "🔹 | Resume", value: "resume" },
              { name: "🔹 | Stop", value: "stop" },
              { name: "🔹 | Lyrics", value: "lyrics" },
              { name: "🔹 | Shuffle", value: "shuffle" },
              { name: "🔹 | Now Playing", value: "nowplaying" }
            )
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guild } = interaction;
    const VC = member.voice.channel;

    const noVC = new EmbedBuilder()
      .setColor("Grey")
      .setDescription(
        "🔹 | You need to be in a voice channel to use this command."
      );

    const alreadyPlaying = new EmbedBuilder()
      .setColor("Grey")
      .setDescription(
        `🔹 | Sorry but I'm already playing music in <#${guild.members.me.voice.channelId}>.`
      );

    if (!VC)
      return interaction.reply({
        embeds: [noVC],
        ephemeral: true,
      });

    if (
      guild.members.me.voice.channelId &&
      VC.id !== guild.members.me.voice.channelId
    )
      return interaction.reply({
        embeds: [alreadyPlaying],
      });

    const player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: member.voice.channel.id,
      textChannel: interaction.channelId,
      selfDeafen: true,
      volume: 100,
    });

    let res;
    let query;

    try {
      const notPlaying = new EmbedBuilder()
        .setColor("Grey")
        .setDescription("🔹 | I'm not playing anything right now.")
        .setTimestamp();

      const invalidVolume = new EmbedBuilder()
        .setColor("Grey")
        .setDescription("🔹| You can only set the volume from 0 to 100.")
        .setTimestamp();

      const noQueue = new EmbedBuilder()
        .setColor("Grey")
        .setDescription("🔹 | There is nothing in the queue.")
        .setTimestamp();

      const enqueueEmbed = new EmbedBuilder();

      switch (options.getSubcommand()) {
        case "play": {
          query = options.getString("query");
          res = await player.search(query, interaction.user);

          if (player.state !== "CONNECTED") player.connect();
          await interaction.deferReply();

          if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();

            return interaction.editReply({
              content:
                "🔹 | An error has occured while trying to add this song.",
            });
          }

          if (res.loadType === "NO_MATCHES") {
            if (!player.queue.current) player.destroy();

            return interaction.editReply({
              content: "🔹 | No results found.",
            });
          }

          if (res.loadType === "PLAYLIST_LOADED") {
            player.queue.add(res.tracks);
            if (!player.playing && !player.paused && !player.queue.size)
              player.play();

            const playlistEmbed = new EmbedBuilder()
              .setDescription(
                `🔹 | **[${res.playlist.name}](${query})** has been added to the queue.`
              )
              .addFields([
                {
                  name: "Enqueued",
                  value: `\`${res.tracks.length}\` tracks`,
                },
              ]);
            return interaction.editReply({ embeds: [playlistEmbed] });
          }

          if (
            res.loadType === "TRACK_LOADED" ||
            res.loadType === "SEARCH_RESULT"
          ) {
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.size)
              player.play();

            enqueueEmbed
              .setColor("Grey")
              .setDescription(
                `🔹 | Enqueued **[${res.tracks[0].title}](${res.tracks[0].uri})** [${member}]`
              )
              .setTimestamp();
            await interaction.editReply({ embeds: [enqueueEmbed] });

            if (player.queue.totalSize > 1)
              enqueueEmbed.addFields({
                name: "Position in queue",
                value: `${player.queue.size - 0}`,
              });
            return interaction.editReply({ embeds: [enqueueEmbed] });
          }
        }
        case "volume": {
          const volume = options.getNumber("percent");

          if (!player.playing)
            return interaction.reply({ embeds: [notPlaying] });

          if (volume < 0 || volume > 100)
            return interaction.reply({
              embeds: [invalidVolume],
              ephemeral: true,
            });

          await player.setVolume(volume);

          const volumeEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setDescription(
              `🔹 | Volume has been set to **${player.volume}%**.`
            );
          return interaction.reply({ embeds: [volumeEmbed] });
        }
        case "repeat": {
          const repeatQueue = new EmbedBuilder()
            .setColor("Grey")
            .setDescription(
              `🔹 | Repeat mode is now ${
                player.queueRepeat ? "off" : "on"
              }. (Queue)`
            )
            .setTimestamp();

          const repeatSong = new EmbedBuilder()
            .setColor("Grey")
            .setDescription(
              `🔹 | Repeat mode is now ${
                player.trackRepeat ? "off" : "on"
              }. (Song)`
            )
            .setTimestamp();

          switch (options.getString("type")) {
            case "queue": {
              if (!player.playing)
                return interaction.reply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              if (!player.queue.length)
                return interaction.reply({
                  embeds: [noQueue],
                  ephemeral: true,
                });

              if (!player.queueRepeat) {
                player.setQueueRepeat(true);
                return interaction.reply({
                  embeds: [repeatQueue],
                });
              }

              if (player.queueRepeat) {
                player.setQueueRepeat(false);
                return interaction.reply({
                  embeds: [repeatQueue],
                });
              }
            }
            case "song": {
              if (!player.playing)
                return interaction.reply({
                  embeds: [notPlaying],
                });

              if (!player.trackRepeat) {
                player.setTrackRepeat(true);
                return interaction.reply({
                  embeds: [repeatSong],
                });
              }

              if (player.trackRepeat) {
                player.setTrackRepeat(false);
                return interaction.reply({
                  embeds: [repeatSong],
                });
              }
            }
          }
        }
        case "settings": {
          const track = player.queue.current;

          const skipEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setDescription(`🔹 | Skipped.`)
            .setTimestamp();

          const npEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setTitle("Now Playing")
            .setDescription(
              `**[${track.title}](${track.uri})** [${player.queue.current.requester}]`
            )
            .setTimestamp();

          const pauseEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setDescription("🔹 | Paused.");

          const resumeEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setDescription("🔹 | Resumed.");

          const stopEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setDescription("🔹 | Stopped.");

          const shuffleEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setDescription("🔹 | Shuffled the queue.");

          switch (options.getString("options")) {
            case "skip": {
              if (!player.playing)
                return interaction.reply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              await player.stop();

              return interaction.reply({ embeds: [skipEmbed] });
            }
            case "nowplaying": {
              if (!player.playing)
                return interaction.reply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              return interaction.reply({ embeds: [npEmbed] });
            }
            case "pause": {
              if (!player.playing)
                return interaction.reply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              await player.pause(true);

              return interaction.reply({ embeds: [pauseEmbed] });
            }
            case "resume": {
              await player.pause(false);

              return interaction.reply({ embeds: [resumeEmbed] });
            }
            case "stop": {
              if (!VC) return interaction.reply({ embeds: [noVC] });
              player.destroy();

              return interaction.reply({ embeds: [stopEmbed] });
            }
            case "lyrics": {
              try {
                if (!player.playing)
                  return interaction.reply({
                    embeds: [notPlaying],
                    ephemeral: true,
                  });

                const trackTitle = track.title
                  .replace("(Official Video)", "")
                  .replace("(Official Audio)", "")
                  .replace("(Official Lyric Video)", "");
                const actualTrack = await gClient.songs.search(trackTitle);
                const searches = actualTrack[0];
                const lyrics = await searches.lyrics();

                const lyricsEmbed = new EmbedBuilder()
                  .setColor("Grey")
                  .setTitle(`🔹 | Lyrics for **${trackTitle}**`)
                  .setDescription(lyrics)
                  .setFooter({ text: "Provided by Genius" })
                  .setTimestamp();
                return interaction.editReply({ embeds: [lyricsEmbed] });
              } catch (_err) {
                const noLyrics = new EmbedBuilder()
                  .setColor("Grey")
                  .setDescription(
                    `🔹 | No lyrics found for **[${track.title}](${track.uri})**.`
                  )
                  .setTimestamp();
                return interaction.reply({ embeds: [noLyrics] });
              }
            }
            case "shuffle": {
              if (!player.playing)
                return interaction.reply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              if (!player.queue.length)
                return interaction.reply({
                  embeds: [noQueue],
                  ephemeral: true,
                });

              await player.queue.shuffle();

              return interaction.reply({ embeds: [shuffleEmbed] });
            }
            case "queue": {
              if (!player.playing)
                return interaction.reply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              if (!player.queue.length)
                return interaction.reply({
                  embeds: [noQueue],
                  ephemeral: true,
                });

              const queue = player.queue.map(
                (t, i) =>
                  `\`${++i}.\` **[${t.title}](${t.uri})** [${t.requester}]`
              );
              const chunked = util.chunk(queue, 10).map((x) => x.join("\n"));

              const queueEmbed = new EmbedBuilder()
                .setColor("Grey")
                .setAuthor({ name: `Current queue for ${guild.name}` })
                .setTitle(
                  `▶️ | Currently playing: ${player.queue.current.title}`
                )
                .setDescription(chunked[0])
                .setTimestamp();
              return interaction.reply({ embeds: [queueEmbed] });
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
};
