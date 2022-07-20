const { CommandInteraction, EmbedBuilder, Client } = require("discord.js");
const util = require("../../utils/util.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "music",
    description: "A complete music system.",
    public: true,
    options: [
        {
            name: "play",
            description: "Plays a song.",
            type: 1,
            options: [{ name: "query", description: "Provide the name of the song or URL.", type: 3, required: true }]
        },
        {
            name: "volume",
            description: "Alter the volume.",
            type: 1,
            options: [{ name: "percent", description: "10 = 10%", type: 10, required: true }]
        },
        {
            name: "repeat",
            description: "Repeat the current song or queue.",
            type: 1,
            options: [{
                name: "type", description: "Select the loop type.", type: 3, required: true,
                choices: [
                    { name: "🔹 | None", value: "none" },
                    { name: "🔹 | Queue", value: "queue" },
                    { name: "🔹 | Song", value: "song" },
                ]
            }],
        },
        {
            name: "settings",
            description: "Select an option.",
            type: 1,
            options: [{
                name: "options", description: "Select an option.", type: 3, required: true,
                choices: [
                    { name: "🔹| View Queue", value: "queue" },
                    { name: "🔹| Skip", value: "skip" },
                    { name: "🔹| Pause", value: "pause" },
                    { name: "🔹| Resume", value: "resume" },
                    { name: "🔹| Stop", value: "stop" },
                    { name: "🔹| Lyrics", value: "lyrics" },
                    { name: "🔹| Shuffle", value: "shuffle" },
                    { name: "🔹| Now Playing", value: "nowplaying" },
                ]
            }],
        }
    ],
    /**
    * @param {CommandInteraction} interaction 
    * @param {Client} client
    */
    async execute(interaction, client) {
        const { options, member, guild } = interaction;
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel)
            return interaction.reply({ content: "You aren't in a voice channel. Join one to be able to play music!", ephemeral: true });

        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: true
        });

        if (player.voiceChannel && VoiceChannel.id !== player.voiceChannel)
            return interaction.reply({ content: `I'm already playing music in <#${player.voiceChannel}>.`, ephemeral: true });

        let res;
        try {
            switch (options.getSubcommand()) {
                case "play": {
                    const query = interaction.options.getString("query");

                    if (query.match(client.lavasfy.spotifyPattern)) {
                        const node = client.lavasfy.nodes.get("main");
                        res = await node.load(query);

                        if (res.loadType === "LOAD_FAILED") {
                            if (!player.queue.current) player.destroy();
                            return interaction.reply({ content: "🔹 | An error has occured while trying to add this song." })
                        }

                        if (res.loadType === "NO_MATCHES") {
                            if (!player.queue.current) player.destroy();
                            return interaction.reply({ content: "🔹 | No results found." })
                        }

                        if (res.loadType === "PLAYLIST_LOADED") {
                            if (player.state !== 'CONNECTED') player.connect();

                            const tracks = [];

                            for (const track of res.tracks) {
                                const trackData = TrackUtils.build(track, interaction.user);
                                tracks.push(trackData);
                            }
                            player.queue.add(tracks);
                            
                            if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();

                            const playlistEmbed = new EmbedBuilder()
                                .setDescription(`🔹 | **[A playlist](${query})** has been added to the queue.`)
                                .addFields([
                                    { name: "Enqueued", value: `\`${res.tracks.length}\` tracks`}
                                ])
                            return interaction.reply({ embeds: [playlistEmbed] })
                        }

                        if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
                            if (player.state !== 'CONNECTED') player.connect()
                            player.queue.add(TrackUtils.build(res.tracks[0], interaction.user));
                        }

                        const enqueueEmbed = new EmbedBuilder()
                            .setColor("Grey")
                            .setDescription(`🔹 | Enqueued **[${res.tracks[0].info.title}](${res.tracks[0].info.uri})** [${member}]`)
                            .setTimestamp()
                        await interaction.reply({ embeds: [enqueueEmbed] });

                        if (!player.playing && !player.paused && !player.queue.size) player.play()

                        if (player.queue.totalSize > 1)
                            enqueueEmbed.addField("Position in queue", `${player.queue.size - 0}`);
                        return interaction.editReply({ embeds: [enqueueEmbed] })

                    } else {
                        try {
                            res = await player.search(query, interaction.user);

                            if (res.loadType === "LOAD_FAILED") {
                                if (!player.queue.current) player.destroy();
                                return interaction.reply({ content: "🔹 | An error has occured while trying to add this song." })
                            }

                            if (res.loadType === "NO_MATCHES") {
                                if (!player.queue.current) player.destroy();
                                return interaction.reply({ content: "🔹 | No results found." })
                            }

                            if (res.loadType === "PLAYLIST_LOADED") {
                                if (player.state !== 'CONNECTED') player.connect()

                                player.queue.add(TrackUtils.build(res.tracks));
                                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                                const playlistEmbed = new EmbedBuilder()
                                    .setDescription(`🔹 | **[${res.playlist.name}](${query})** has been added to the queue.`)
                                    .addField("Enqueued", `\`${res.tracks.length}\` tracks`)
                                return interaction.reply({ embeds: [playlistEmbed] })
                            }

                            if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
                                if (player.state !== 'CONNECTED') player.connect()
                                player.queue.add(res.tracks[0]);
                            }

                            const enqueueEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setDescription(`🔹 | Enqueued **[${res.tracks[0].title}](${res.tracks[0].uri})** [${member}]`)
                                .setTimestamp()
                            await interaction.reply({ embeds: [enqueueEmbed] });

                            if (!player.playing && !player.paused && !player.queue.size) player.play()

                            if (player.queue.totalSize > 1)
                                enqueueEmbed.addField("Position in queue", `${player.queue.size - 0}`);
                            return interaction.editReply({ embeds: [enqueueEmbed] })
                        }
                        catch (e) {
                            console.log(e)
                        }
                    }
                }
                case "volume": {
                    const volume = options.getNumber("percent");
                    if (!player.playing) return interaction.reply({ content: "🔹| There is nothing in the queue." })
                    if (volume < 0 || volume > 100) return interaction.reply({ content: `🔹| You can only set the volume from 0 to 100.` })
                    player.setVolume(volume);

                    const volumeEmbed = new EmbedBuilder()
                        .setColor("Grey")
                        .setDescription(`🔹 | Volume has been set to **${player.volume}%**.`)
                    return interaction.reply({ embeds: [volumeEmbed] })
                }
                case "repeat": {
                    switch(options.getString("type")) {
                        case "none": {
                            if(!player.trackRepeat && !player.queueRepeat) return interaction.reply({ content: "🔹 | Repeat mode is not enabled at all." })

                            if(player.trackRepeat) {
                                player.setTrackRepeat(false);
                                return interaction.reply({ content: "🔹 | Repeat mode has been disabled. (Song)" })
                            };

                            if(player.queueRepeat) {
                                player.setQueueRepeat(false);
                                return interaction.reply({ content: "🔹 | Repeat mode has been disabled. (Queue)" })
                            };
                        }
                        case "queue": {
                            if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." });
                            if (!player.queue.length) return interaction.reply({ content: "There is nothing in the queue." });

                            if(!player.queueRepeat) {
                                player.setQueueRepeat(true);
                                return interaction.reply({ content: "🔹 | Repeat mode has been enabled. (Queue)" })
                            };
                        };
                        case "song": {
                            if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." });

                            if(!player.trackRepeat) {
                                player.setTrackRepeat(true);
                                return interaction.reply({ content: "🔹 | Repeat mode has been enabled. (Song)" })
                            };
                        };
                    }
                }
                case "settings": {
                    switch (options.getString("options")) {
                        case "skip": {
                            if (!player.playing) return interaction.reply({ content: "🔹| There is nothing in the queue." })
                            await player.stop();

                            const skipEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setDescription(`🔹 | Skipped.`)
                                .setTimestamp()

                            return interaction.reply({ embeds: [skipEmbed] });
                        }
                        case "nowplaying": {
                            const track = player.queue.current;

                            const npEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setTitle("Now Playing")
                                .setDescription(`[${track.title}](${track.uri}) [${player.queue.current.requester}]`)
                                .setTimestamp()
                            return interaction.reply({ embeds: [npEmbed] })
                        }
                        case "pause": {
                            if (!player.playing) return interaction.reply({ content: "🔹 | There is nothing in the queue." })

                            await player.pause(true);

                            const pauseEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setDescription("🔹 | Paused.")
                            return interaction.reply({ embeds: [pauseEmbed] })
                        }
                        case "resume": {
                            await player.pause(false);

                            const resumeEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setDescription("🔹 | Resumed.")
                            return interaction.reply({ embeds: [resumeEmbed] })
                        }
                        case "stop": {
                            player.destroy()

                            const disconnectEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setDescription("🔹 | Disconnected.")
                            return interaction.reply({ embeds: [disconnectEmbed] })
                        }
                        case "lyrics": {
                            const track = player.queue.current;
                            const trackTitle = track.title.replace("(Official Video)", "").replace("(Official Audio)", "");
                            const actualTrack = await gClient.songs.search(trackTitle);
                            const searches = actualTrack[0];
                            const lyrics = await searches.lyrics();

                            const lyricsEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setTitle(`🔹 | Lyrics for **${trackTitle}**`)
                                .setDescription(lyrics)
                                .setFooter({ text: "Provided by Genius" })
                                .setTimestamp()
                            return interaction.reply({ embeds: [lyricsEmbed] })
                        }
                        case "shuffle": {
                            if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." });
                            if (!player.queue.length) return interaction.reply({ content: "There is nothing in the queue." });

                            player.queue.shuffle()

                            const shuffleEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setDescription("🔹 | Shuffled the queue.")
                            return interaction.reply({ embeds: [shuffleEmbed] })
                        }
                        case "queue": {
                            if (!player.playing) return interaction.reply({ content: "There is nothing in the queue." });
                            if (!player.queue.length) return interaction.reply({ content: "There is nothing in the queue." });

                            const queue = player.queue.map((t, i) => `\`${++i}.\` **${t.title}** [${t.requester}]`);
                            const chunked = util.chunk(queue, 10).map(x => x.join("\n"));

                            const queueEmbed = new EmbedBuilder()
                                .setColor("Grey")
                                .setTitle(`Current queue for ${guild.name}`)
                                .setDescription(chunked[0])
                                .setTimestamp()

                            return interaction.reply({ embeds: [queueEmbed] });
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}