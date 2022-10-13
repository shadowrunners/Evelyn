const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();
const { embedPages, progressbar } = require("../../utils/utils.js");
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
    const embed = new EmbedBuilder();
    const VC = member.voice.channel;

    await interaction.deferReply();

    if (!VC)
      return interaction.editReply({
        embeds: [
          embed
            .setColor("Blurple")
            .setDescription(
              "🔹 | You need to be in a voice channel to use this command."
            )
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    if (
      guild.members.me.voice.channelId &&
      VC.id !== guild.members.me.voice.channelId
    )
      return interaction.editReply({
        embeds: [
          embed
            .setColor("Blurple")
            .setDescription(
              `🔹 | Sorry but I'm already playing music in <#${guild.members.me.voice.channelId}>.`
            )
            .setTimestamp(),
        ],
      });

    const player = await client.manager.createPlayer({
      guildId: interaction.guild.id,
      voiceId: member.voice.channel.id,
      textId: interaction.channelId,
      deaf: true,
    });

    const songs = [];
    const embeds = [];

    let res;
    let query;

    try {
      const notPlaying = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("🔹 | I'm not playing anything right now.")
        .setTimestamp();

      const noQueue = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("🔹 | There is nothing in the queue.")
        .setTimestamp();

      switch (options.getSubcommand()) {
        case "play":
          query = options.getString("query");
          res = await player.search(query, {
            requester: interaction.user,
          });

          if (!res.tracks.length) {
            if (player) player.destroy();

            return interaction.editReply({
              embeds: [
                embed
                  .setColor("Blurple")
                  .setDescription("🔹 | No results found.")
                  .setTimestamp(),
              ],
            });
          }

          if (res.type === "PLAYLIST") {
            const tracks = res.tracks;
            for (const track of tracks) player.queue.add(track);

            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === res.tracks.length
            )
              player.play();

            embed
              .setColor("Blurple")
              .setAuthor({
                name: "Playlist added to the queue",
                iconURL: member.user.avatarURL({ dynamic: true }),
              })
              .setDescription(`**[${res.playlistName}](${query})**`)
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
            return interaction.editReply({ embeds: [embed] });
          }

          if (res.type === "TRACK" || res.type === "SEARCH") {
            player.queue.add(res.tracks[0]);

            if (!player.playing && !player.paused && !player.queue.size)
              player.play();

            embed
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
            await interaction.editReply({ embeds: [embed] });

            if (player.queue.totalSize > 1)
              embed.addFields({
                name: "Position in queue",
                value: `${player.queue.size - 0}`,
                inline: true,
              });
            return interaction.editReply({ embeds: [embed] });
          }

        case "volume": {
          const volume = options.getNumber("percent");

          if (!player.playing)
            return interaction.editReply({ embeds: [notPlaying] });

          if (volume < 0 || volume > 100)
            return interaction.editReply({
              embeds: [
                embed
                  .setColor("Blurple")
                  .setDescription(
                    "🔹| You can only set the volume from 0 to 100."
                  )
                  .setTimestamp(),
              ],
              ephemeral: true,
            });

          await player.setVolume(volume);

          return interaction.editReply({
            embeds: [
              embed
                .setColor("Blurple")
                .setDescription(
                  `🔹 | Volume has been set to **${player.volume}%**.`
                ),
            ],
          });
        }
        case "repeat": {
          if (!player.playing)
            return interaction.editReply({
              embeds: [notPlaying],
              ephemeral: true,
            });

          switch (options.getString("type")) {
            case "queue": {
              if (!player.queue.length)
                return interaction.editReply({
                  embeds: [noQueue],
                  ephemeral: true,
                });

              if (!player.queueRepeat) {
                await player.setLoop("queue");

                return interaction.editReply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Blurple")
                      .setDescription("🔹 | Repeat mode is now on. (Queue)")
                      .setTimestamp(),
                  ],
                });
              } else {
                await player.setLoop("off");

                return interaction.editReply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Blurple")
                      .setDescription("🔹 | Repeat mode is now off.")
                      .setTimestamp(),
                  ],
                });
              }
            }
            case "song": {
              if (!player.trackRepeat) {
                await player.setLoop("track");

                return interaction.editReply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Blurple")
                      .setDescription("🔹 | Repeat mode is now on. (Song)")
                      .setTimestamp(),
                  ],
                });
              } else {
                await player.setLoop("off");
                return interaction.editReply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Blurple")
                      .setDescription("🔹 | Repeat mode is now off.")
                      .setTimestamp(),
                  ],
                });
              }
            }
          }
        }
        case "seek": {
          const time = options.getNumber("time");
          const seekDuration = Number(time) * 1000;
          const duration = player.queue.current.length;

          if (seekDuration <= duration) {
            await player.shoukaku.seekTo(seekDuration);

            return interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Blurple")
                  .setDescription(`🔹 | Seeked to ${pms(seekDuration)}.`)
                  .setTimestamp(),
              ],
            });
          } else {
            return interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Blurple")
                  .setDescription(
                    `🔹 | Couldn't seek song, the provided seek duration might've gone over the song's duration.`
                  )
                  .setTimestamp(),
              ],
            });
          }
        }
        case "settings": {
          const track = player.queue.current;

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

          switch (options.getString("options")) {
            case "skip":
              player.skip();

              return interaction.editReply({
                embeds: [
                  embed
                    .setColor("Blurple")
                    .setDescription("🔹 | Skipped.")
                    .setTimestamp(),
                ],
              });

            case "nowplaying":
              return interaction.editReply({
                embeds: [
                  embed
                    .setColor("Blurple")
                    .setAuthor({
                      name: "Now Playing",
                      iconURL: member.user.avatarURL({ dynamic: true }),
                    })
                    .setDescription(
                      `**[${track.title}](${track.uri})** [${track.requester}]
                      
                      \`${pms(player.shoukaku.position)}\` ${await progressbar(
                        player
                      )} \`${pms(track.length)}\`
                    `
                    )
                    .setTimestamp(),
                ],
              });

            case "pause":
              player.pause(true);

              return interaction.editReply({
                embeds: [
                  embed
                    .setColor("Blurple")
                    .setDescription("🔹 | Paused.")
                    .setTimestamp(),
                ],
              });

            case "resume":
              player.pause(false);

              return interaction.editReply({
                embeds: [
                  embed
                    .setColor("Blurple")
                    .setDescription("🔹 | Resumed.")
                    .setTimestamp(),
                ],
              });

            case "stop": {
              if (!VC) return interaction.editReply({ embeds: [noVC] });

              player.destroy();

              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription("🔹 | Stopped.")
                    .setTimestamp(),
                ],
              });
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
              } catch (_err) {
                return interaction.editReply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Blurple")
                      .setDescription(
                        `🔹 | No lyrics found for **[${track.title}](${track.uri})**.`
                      )
                      .setTimestamp(),
                  ],
                });
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

              player.queue.shuffle();

              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription("🔹 | Shuffled.")
                    .setTimestamp(),
                ],
              });
            }
            case "queue":
              for (let i = 0; i < player.queue.length; i++) {
                songs.push(
                  `${i + 1}. [${player.queue[i].title}](${
                    player.queue[i].uri
                  }) [${player.queue[i].requester}]`
                );
              }

              for (let i = 0; i < songs.length; i += 10) {
                embed
                  .setColor("Blurple")
                  .setAuthor({ name: `Current queue for ${guild.name}` })
                  .setTitle(
                    `▶️ | Currently playing: ${player.queue.current.title}`
                  )
                  .setDescription(songs.slice(i, i + 10).join("\n"))
                  .setTimestamp();
                embeds.push(embed);
              }
              return await embedPages(client, interaction, embeds);

            case "queueclear":
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

              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription("🔹 | Queue cleared.")
                    .setTimestamp(),
                ],
              });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
};
