const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();
const { embedPages } = require("../../utils/pages.js");
const { progressbar } = require("../../utils/progressBar.js");
const pms = require("pretty-ms");

module.exports = {
  botPermissions: ["SendMessages", "EmbedLinks", "Connect", "Speak"],
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
        .setName("seek")
        .setDescription("Skip to a specific time in the song.")
        .addNumberOption((option) =>
          option
            .setName("time")
            .setDescription("Provide the timestamp.")
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
              { name: "🔹 | Clear Queue", value: "queueclear" },
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

    await interaction.deferReply();

    const noVC = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        "🔹 | You need to be in a voice channel to use this command."
      );

    const alreadyPlaying = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        `🔹 | Sorry but I'm already playing music in <#${guild.members.me.voice.channelId}>.`
      );

    if (!VC)
      return interaction.editReply({
        embeds: [noVC],
        ephemeral: true,
      });

    if (
      guild.members.me.voice.channelId &&
      VC.id !== guild.members.me.voice.channelId
    )
      return interaction.editReply({
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
        .setColor("Blurple")
        .setDescription("🔹 | I'm not playing anything right now.")
        .setTimestamp();

      const invalidVolume = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("🔹| You can only set the volume from 0 to 100.")
        .setTimestamp();

      const noQueue = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("🔹 | There is nothing in the queue.")
        .setTimestamp();

      const noQueryFound = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("🔹 | No results found.")
        .setTimestamp();

      const errorOccured = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(
          "🔹 | An error has occured while trying to add this song."
        )
        .setTimestamp();

      const enqueueEmbed = new EmbedBuilder();

      const playlistEmbed = new EmbedBuilder();

      switch (options.getSubcommand()) {
        case "play": {
          query = options.getString("query");
          res = await player.search(query, interaction.user);

          if (player.state !== "CONNECTED") player.connect();

          if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();

            return interaction.editReply({
              embeds: [errorOccured],
            });
          }

          if (res.loadType === "NO_MATCHES") {
            if (!player.queue.current) player.destroy();

            return interaction.editReply({
              embeds: [noQueryFound],
            });
          }

          if (res.loadType === "PLAYLIST_LOADED") {
            player.queue.add(res.tracks);

            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === res.tracks.length
            )
              player.play();

            playlistEmbed
              .setColor("Blurple")
              .setAuthor({
                name: "Playlist added to the queue",
                iconURL: member.user.avatarURL({ dynamic: true }),
              })
              .setDescription(`**[${res.playlist.name}](${query})**`)
              .addFields(
                {
                  name: "Added",
                  value: `\`${res.tracks.length}\` tracks`,
                  inline: true,
                },
                {
                  name: "Queued by",
                  value: `${member}`,
                  inline: true,
                }
              )
              .setThumbnail(res.tracks[0].thumbnail)
              .setTimestamp();
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
              .setColor("Blurple")
              .setAuthor({
                name: "Added to the queue",
                iconURL: member.user.avatarURL({ dynamic: true }),
              })
              .setDescription(
                `**[${res.tracks[0].title}](${res.tracks[0].uri})** `
              )
              .addFields({
                name: "Queued by",
                value: `${member}`,
                inline: true,
              })
              .setThumbnail(res.tracks[0].thumbnail)
              .setTimestamp();
            await interaction.editReply({ embeds: [enqueueEmbed] });

            if (player.queue.totalSize > 1)
              enqueueEmbed.addFields({
                name: "Position in queue",
                value: `${player.queue.size - 0}`,
                inline: true,
              });
            return interaction.editReply({ embeds: [enqueueEmbed] });
          }
        }
        case "volume": {
          const volume = options.getNumber("percent");

          if (!player.playing)
            return interaction.editReply({ embeds: [notPlaying] });

          if (volume < 0 || volume > 100)
            return interaction.editReply({
              embeds: [invalidVolume],
              ephemeral: true,
            });

          await player.setVolume(volume);

          const volumeEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `🔹 | Volume has been set to **${player.volume}%**.`
            );
          return interaction.editReply({ embeds: [volumeEmbed] });
        }
        case "repeat": {
          const repeatQueue = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `🔹 | Repeat mode is now ${
                player.queueRepeat ? "off" : "on"
              }. (Queue)`
            )
            .setTimestamp();

          const repeatSong = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `🔹 | Repeat mode is now ${
                player.trackRepeat ? "off" : "on"
              }. (Song)`
            )
            .setTimestamp();

          switch (options.getString("type")) {
            case "queue": {
              if (!player.playing)
                return interaction.editReply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              if (!player.queue.length)
                return interaction.editReply({
                  embeds: [noQueue],
                  ephemeral: true,
                });

              if (!player.queueRepeat) {
                player.setQueueRepeat(true);
                return interaction.editReply({
                  embeds: [repeatQueue],
                });
              }

              if (player.queueRepeat) {
                player.setQueueRepeat(false);
                return interaction.editReply({
                  embeds: [repeatQueue],
                });
              }
            }
            case "song": {
              if (!player.playing)
                return interaction.editReply({
                  embeds: [notPlaying],
                });

              if (!player.trackRepeat) {
                player.setTrackRepeat(true);
                return interaction.editReply({
                  embeds: [repeatSong],
                });
              }

              if (player.trackRepeat) {
                player.setTrackRepeat(false);
                return interaction.editReply({
                  embeds: [repeatSong],
                });
              }
            }
          }
        }
        case "seek": {
          const time = options.getNumber("time");
          const seekDuration = Number(time) * 1000;
          const duration = player.queue.current.duration;

          if (seekDuration <= duration) {
            player.seek(seekDuration);

            const seekedEmbed = new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(`🔹 | Seeked to ${pms(seekDuration)}.`)
              .setTimestamp();
            return interaction.editReply({ embeds: [seekedEmbed] });
          } else {
            const noSeek = new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(
                `🔹 | Couldn't seek song, the provided seek duration might've gone over the song's duration.`
              )
              .setTimestamp();
            return interaction.editReply({ embeds: [noSeek] });
          }
        }
        case "settings": {
          const track = player.queue.current;

          const skipEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Skipped.`)
            .setTimestamp();

          const pauseEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | Paused.");

          const resumeEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | Resumed.");

          const stopEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | Stopped.");

          const shuffleEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | Shuffled the queue.");

          switch (options.getString("options")) {
            case "skip": {
              if (!player.playing)
                return interaction.editReply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              await player.stop();

              return interaction.editReply({ embeds: [skipEmbed] });
            }
            case "nowplaying": {
              if (!player.playing)
                return interaction.editReply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              const npEmbed = new EmbedBuilder()
                .setColor("Blurple")
                .setAuthor({
                  name: "Now Playing",
                  iconURL: member.user.avatarURL({ dynamic: true }),
                })
                .setDescription(
                  `[${track.title}](${track.uri}) [${
                    player.queue.current.requester
                  }]
                  
                  \`${pms(player.position)}\` ${progressbar(player)} \`${pms(
                    player.queue.current.duration
                  )}\`
                `
                )
                .setTimestamp();
              return interaction.editReply({ embeds: [npEmbed] });
            }
            case "pause": {
              if (!player.playing)
                return interaction.editReply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              await player.pause(true);

              return interaction.editReply({ embeds: [pauseEmbed] });
            }
            case "resume": {
              await player.pause(false);

              return interaction.editReply({ embeds: [resumeEmbed] });
            }
            case "stop": {
              if (!VC) return interaction.editReply({ embeds: [noVC] });
              player.destroy();

              return interaction.editReply({ embeds: [stopEmbed] });
            }
            case "lyrics": {
              try {
                if (!player.playing)
                  return interaction.editReply({
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
                  .setColor("Blurple")
                  .setAuthor({
                    name: `🔹 | Lyrics for ${trackTitle}`,
                    url: searches.url,
                  })
                  .setDescription(lyrics)
                  .setFooter({ text: "Lyrics are powered by Genius." })
                  .setTimestamp();
                return interaction.editReply({ embeds: [lyricsEmbed] });
              } catch (_err) {
                const noLyrics = new EmbedBuilder()
                  .setColor("Blurple")
                  .setDescription(
                    `🔹 | No lyrics found for **[${track.title}](${track.uri})**.`
                  )
                  .setTimestamp();
                return interaction.editReply({ embeds: [noLyrics] });
              }
            }
            case "shuffle": {
              if (!player.playing)
                return interaction.editReply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              if (!player.queue.length)
                return interaction.editReply({
                  embeds: [noQueue],
                  ephemeral: true,
                });

              await player.queue.shuffle();

              return interaction.editReply({ embeds: [shuffleEmbed] });
            }
            case "queue": {
              if (!player.playing)
                return interaction.editReply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              if (!player.queue.length)
                return interaction.editReply({
                  embeds: [noQueue],
                  ephemeral: true,
                });

              const songs = [];
              const embeds = [];

              for (let i = 0; i < player.queue.length; i++) {
                songs.push(
                  `${i + 1}. [${player.queue[i].title}](${
                    player.queue[i].uri
                  }) [${player.queue[i].requester}]`
                );
              }

              if (songs.length < 10) {
                const queueEmbed = new EmbedBuilder()
                  .setColor("Blurple")
                  .setAuthor({ name: `Current queue for ${guild.name}` })
                  .setTitle(
                    `▶️ | Currently playing: ${player.queue.current.title}`
                  )
                  .setDescription(songs.slice(0, 10).join("\n"))
                  .setTimestamp();
                return interaction.editReply({ embeds: [queueEmbed] });
              } else {
                for (let i = 0; i < songs.length; i += 10) {
                  const queueEmbed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setAuthor({ name: `Current queue for ${guild.name}` })
                    .setTitle(
                      `▶️ | Currently playing: ${player.queue.current.title}`
                    )
                    .setDescription(songs.slice(i, i + 10).join("\n"))
                    .setTimestamp();
                  embeds.push(queueEmbed);
                }
              }
              await embedPages(client, interaction, embeds);
            }
            case "queueclear": {
              if (!player.playing)
                return interaction.editReply({
                  embeds: [notPlaying],
                  ephemeral: true,
                });

              if (!player.queue.length)
                return interaction.editReply({
                  embeds: [noQueue],
                  ephemeral: true,
                });

              player.queue.clear();
              player.stop();

              const clearQueue = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription("🔹 | Queue cleared.")
                .setTimestamp();
              return interaction.editReply({ embeds: [clearQueue] });
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
};
