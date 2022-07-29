const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client} = require("discord.js");
const util = require("../../utils/util.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();
const { TrackUtils } = require("erela.js");
const pagination = require("discordjs-button-pagination");

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
            .setName("volume")
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
              { name: "🔹| None", value: "none" },
              { name: "🔹| Queue", value: "queue" },
              { name: "🔹| Song", value: "song" }
            )
        )
    )
    .addSubcommand((options) =>
      options
        .setName("settings")
        .setDescription("Select an option.")
        .addStringOption((option) =>
          option
            .setName("option")
            .setDescription("Select an option.")
            .setRequired(true)
            .addChoices(
              { name: "🔹| View Queue", value: "queue" },
              { name: "🔹| Skip", value: "skip" },
              { name: "🔹| Pause", value: "pause" },
              { name: "🔹| Resume", value: "resume" },
              { name: "🔹| Stop", value: "stop" },
              { name: "🔹| Lyrics", value: "lyrics" },
              { name: "🔹| Shuffle", value: "shuffle" },
              { name: "🔹| Now Playing", value: "nowplaying" }
            )
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guild } = interaction;
    const VoiceChannel = member.voice.channel;

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

    if (!VoiceChannel)
      return interaction.reply({
        embeds: [noVC],
        ephemeral: true,
      });

    if (
      guild.members.me.voice.channelId &&
      VoiceChannel.id !== guild.members.me.voice.channelId
    )
      return interaction.reply({
        embeds: [alreadyPlaying],
      });

    const player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: member.voice.channel.id,
      textChannel: interaction.channelId,
      selfDeafen: true,
    });

    let res;
    try {
      switch (options.getSubcommand()) {
        case "play": {
          const query = interaction.options.getString("query");
          if (player.state !== "CONNECTED") player.connect();

          if (query.match(client.lavasfy.spotifyPattern)) {
            const node = client.lavasfy.nodes.get("main");
            res = await node.load(query);

            if (res.loadType === "LOAD_FAILED") {
              if (!player.queue.current) player.destroy();
              return interaction.reply({
                content:
                  "🔹 | An error has occured while trying to add this song.",
              });
            }

            if (res.loadType === "NO_MATCHES") {
              if (!player.queue.current) player.destroy();
              return interaction.reply({ content: "🔹 | No results found." });
            }

            if (res.loadType === "PLAYLIST_LOADED") {
              await interaction.deferReply({});

              const tracks = [];

              for (const track of res.tracks) {
                const trackData = TrackUtils.build(track, interaction.user);
                tracks.push(trackData);
              }
              player.queue.add(tracks);

              if (
                !player.playing &&
                !player.paused &&
                player.queue.totalSize === res.tracks.length
              )
                player.play();

              const playlistEmbed = new EmbedBuilder()
                .setDescription(
                  `🔹 | **[A playlist](${query})** has been added to the queue.`
                )
                .addFields([
                  {
                    name: "Enqueued",
                    value: `\`${res.tracks.length}\` tracks`,
                  },
                ]);
              await interaction.followUp({ embeds: [playlistEmbed] });
            }

            if (
              res.loadType === "TRACK_LOADED" ||
              res.loadType === "SEARCH_RESULT"
            ) {
              
              player.queue.add(
                TrackUtils.build(res.tracks[0], interaction.user)
              );

              if (!player.playing && !player.paused && !player.queue.size)
                player.play();

              const enqueueEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription(
                  `🔹 | Enqueued **[${res.tracks[0].info.title}](${res.tracks[0].info.uri})** [${member}]`
                )
                .setTimestamp();
              interaction.reply({ embeds: [enqueueEmbed] });

              if (player.queue.totalSize > 1)
              enqueueEmbed.addFields([
                {
                  name: "Position in queue",
                  value: `${player.queue.size - 0}`,
                },
              ]);
            return interaction.editReply({ embeds: [enqueueEmbed] });
            }
          }

          if (!query.match(client.lavasfy.spotifyPattern)) {
            try {
              res = await player.search(query, interaction.user);

              if (res.loadType === "LOAD_FAILED") {
                if (!player.queue.current) player.destroy();
                return interaction.reply({
                  content:
                    "🔹 | An error has occured while trying to add this song.",
                });
              }

              if (res.loadType === "NO_MATCHES") {
                if (!player.queue.current) player.destroy();
                return interaction.reply({
                  content: "🔹 | No results found.",
                });
              }

              if (res.loadType === "PLAYLIST_LOADED") {
                interaction.deferReply({});

                player.queue.add(TrackUtils.build(res.tracks));
                if (
                  !player.playing &&
                  !player.paused &&
                  player.queue.totalSize === res.tracks.length
                )
                  player.play();
                const playlistEmbed = new EmbedBuilder()
                  .setDescription(
                    `🔹 | **[${res.playlist.name}](${query})** has been added to the queue.`
                  )
                  .addField("Enqueued", `\`${res.tracks.length}\` tracks`);
                return interaction.followUp({ embeds: [playlistEmbed] });
              }

              if (
                res.loadType === "TRACK_LOADED" ||
                res.loadType === "SEARCH_RESULT"
              ) {
                if (player.state !== "CONNECTED") player.connect();
                player.queue.add(res.tracks[0]);
              }

              if (!player.playing && !player.paused && !player.queue.size)
                player.play();

              const enqueueEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription(
                  `🔹 | Enqueued **[${res.tracks[0].title}](${res.tracks[0].uri})** [${member}]`
                )
                .setTimestamp();
              interaction.reply({ embeds: [enqueueEmbed] });

              if (player.queue.totalSize > 1)
                enqueueEmbed.addFields([
                  {
                    name: "Position in queue",
                    value: `${player.queue.size - 0}`,
                  },
                ]);
              return interaction.editReply({ embeds: [enqueueEmbed] });
            } catch (e) {
              console.log(e);
            }
          }
        }
        break;
        case "volume": {
          const volume = options.getNumber("percent");
          if (!player.playing)
            return interaction.reply({
              content: "🔹| There is nothing in the queue.",
            });
          if (volume < 0 || volume > 100)
            return interaction.reply({
              content: `🔹| You can only set the volume from 0 to 100.`,
            });
          player.setVolume(volume);

          const volumeEmbed = new EmbedBuilder()
            .setColor("BLURPLE")
            .setDescription(
              `🔹 | Volume has been set to **${player.volume}%**.`
            );
          return interaction.reply({ embeds: [volumeEmbed] });
        }
        case "repeat": {
          switch (options.getString("type")) {
            case "none":
              {
                if (!player.trackRepeat && !player.queueRepeat)
                  return interaction.reply({
                    content: "🔹 | Repeat mode is not enabled at all.",
                  });

                if (player.trackRepeat) {
                  player.setTrackRepeat(false);
                  return interaction.reply({
                    content: "🔹 | Repeat mode has been disabled. (Song)",
                  });
                }

                if (player.queueRepeat) {
                  player.setQueueRepeat(false);
                  return interaction.reply({
                    content: "🔹 | Repeat mode has been disabled. (Queue)",
                  });
                }
              }
              break;
            case "queue":
              {
                if (!player.playing)
                  return interaction.reply({
                    content: "There is nothing in the queue.",
                  });
                if (!player.queue.length)
                  return interaction.reply({
                    content: "There is nothing in the queue.",
                  });

                if (!player.queueRepeat) {
                  player.setQueueRepeat(true);
                  return interaction.reply({
                    content: "🔹 | Repeat mode has been enabled. (Queue)",
                  });
                }
              }
              break;
            case "song":
              {
                if (!player.playing)
                  return interaction.reply({
                    content: "There is nothing in the queue.",
                  });

                if (!player.trackRepeat) {
                  player.setTrackRepeat(true);
                  return interaction.reply({
                    content: "🔹 | Repeat mode has been enabled. (Song)",
                  });
                }
              }
              break;
          }
        }
        case "settings": {
          switch (options.getString("options")) {
            case "skip": {
              if (!player.playing)
                return interaction.reply({
                  content: "🔹| There is nothing in the queue.",
                });
              await player.stop();

              const skipEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription(`🔹 | Skipped.`)
                .setTimestamp();

              return interaction.reply({ embeds: [skipEmbed] });
            }
            case "nowplaying": {
              const track = player.queue.current;

              const npEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setTitle("Now Playing")
                .setDescription(
                  `[${track.title}](${track.uri}) [${player.queue.current.requester}]`
                )
                .setTimestamp();
              return interaction.reply({ embeds: [npEmbed] });
            }
            case "pause": {
              if (!player.playing)
                return interaction.reply({
                  content: "🔹 | There is nothing in the queue.",
                });

              await player.pause(true);

              const pauseEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹 | Paused.");
              return interaction.reply({ embeds: [pauseEmbed] });
            }
            case "resume": {
              await player.pause(false);

              const resumeEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹 | Resumed.");
              return interaction.reply({ embeds: [resumeEmbed] });
            }
            case "stop": {
              player.destroy();

              const disconnectEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹 | Disconnected.");
              return interaction.reply({ embeds: [disconnectEmbed] });
            }
            case "lyrics": {
              const track = player.queue.current;
              const trackTitle = track.title
                .replace("(Official Video)", "")
                .replace("(Official Audio)", "");
              const actualTrack = await gClient.songs.search(trackTitle);
              const searches = actualTrack[0];
              const lyrics = await searches.lyrics();

              const lyricsEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setTitle(`🔹 | Lyrics for **${trackTitle}**`)
                .setDescription(lyrics)
                .setFooter({ text: "Provided by Genius" })
                .setTimestamp();
              return interaction.reply({ embeds: [lyricsEmbed] });
            }
            case "shuffle": {
              if (!player.playing)
                return interaction.reply({
                  content: "There is nothing in the queue.",
                });
              if (!player.queue.length)
                return interaction.reply({
                  content: "There is nothing in the queue.",
                });

              player.queue.shuffle();

              const shuffleEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription("🔹 | Shuffled the queue.");
              return interaction.reply({ embeds: [shuffleEmbed] });
            }
            case "queue": {
              if (!player.playing)
                return interaction.reply({
                  content: "There is nothing in the queue.",
                });
              if (!player.queue.length)
                return interaction.reply({
                  content: "There is nothing in the queue.",
                });

                const queue = player.queue.map(
                  (t, i) => `\`${++i}.\` **${t.title}** [${t.requester}]`
                );
                const chunked = util.chunk(queue, 10).map((x) => x.join("\n"));

                const queueEmbed = new EmbedBuilder()
                  .setColor("BLURPLE")
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
      //let errEmbed = new EmbedBuilder()
      //.setColor("BLURPLE")
      //.setTitle("Uh oh...")
      //.setDescription(`🔹 | An error has occured. ${e} \nReport this issue to scrappie in the [CryoLabs Discord server.](https://discord.gg/HwkDSs7X82)`)
      //.setFooter({ text: "Don't worry as long as you're not scrappie." })
      //return interaction.reply({ embeds: [errEmbed] })
    }
  },
};
