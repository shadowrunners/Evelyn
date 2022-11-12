const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { checkVoice } = require("../../../utils/musicUtils.js");

module.exports = {
  subCommand: "music.play",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member } = interaction;
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    await interaction.deferReply();
    if (await checkVoice(interaction)) return;

    const player = client.manager.createConnection({
      guildId: interaction.guild.id,
      voiceChannel: interaction.member.voice.channelId,
      textChannel: interaction.channelId,
      selfDeaf: true,
    });

    const query = options.getString("query");
    const res = await client.manager.resolve(query);
    const { loadType, tracks, playlistInfo } = res;

    if (player.state !== "CONNECTED") player.connect();

    if (res.loadType === "LOAD_FAILED") {
      if (!player.queue.current) player.destroy();

      return interaction.editReply({
        embeds: [embed.setDescription("🔹 | An error has occured.")],
      });
    }

    if (loadType === "PLAYLIST_LOADED") {
      for (const track of tracks) {
        track.info.requester = interaction.member;
        player.queue.add(track);
      }

      await interaction.editReply({
        embeds: [
          embed
            .setAuthor({
              name: "Playlist added to the queue",
              iconURL: member.user.avatarURL({ dynamic: true }),
            })
            .setDescription(`**[${playlistInfo.name}](${query})**`)
            .addFields(
              {
                name: "Added",
                value: `\`${tracks.length}\` tracks`,
                inline: true,
              },
              {
                name: "Queued by",
                value: `${member}`,
                inline: true,
              }
            ),
        ],
      });

      if (!player.isPlaying && !player.isPaused) return player.play();
    }

    if (loadType === "TRACK_LOADED" || loadType === "SEARCH_RESULT") {
      const track = tracks.shift();
      track.info.requester = interaction.member;

      embed
        .setAuthor({
          name: "Added to the queue",
          iconURL: member.user.avatarURL({ dynamic: true }),
        })
        .setDescription(`**[${track.info.title}](${track.info.uri})** `)
        .addFields({
          name: "Queued by",
          value: `${member}`,
          inline: true,
        })
        .setThumbnail(track.info.image);
      await interaction.editReply({ embeds: [embed] });

      player.queue.add(track);

      if (!player.isPlaying && !player.isPaused) return player.play();

      if (player.queue.length > 1)
        embed.addFields({
          name: "Position in queue",
          value: `${player.queue.size - 1}`,
          inline: true,
        });
      return interaction.editReply({ embeds: [embed] });
    }
  },
};
