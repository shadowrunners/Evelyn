const { EmbedBuilder } = require("discord.js");
const pms = require("pretty-ms");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

module.exports = {
  progressbar: (player) => {
    const size = 15;
    const line = "▬";
    const slider = "🔘";

    if (!player.queue.current) return `${slider}${line.repeat(size - 1)}]`;
    const current =
<<<<<<< Updated upstream
      player.queue.current.length !== 0
        ? player.shoukaku.position
        : player.queue.current.length;
    const total = player.queue.current.length;
=======
      player.currentTrack.length !== 0
        ? player.position
        : player.currentTrack.length;
    const total = player.currentTrack.length;
>>>>>>> Stashed changes
    const bar =
      current > total
        ? [line.repeat((size / 2) * 2), (current / total) * 100]
        : [
            line
              .repeat(Math.round((size / 2) * (current / total)))
              .replace(/.$/, slider) +
              line.repeat(size - Math.round(size * (current / total)) + 1),
            current / total,
          ];

    if (!String(bar).includes(slider))
      return `${slider}${line.repeat(size - 1)}`;
    return `${bar[0]}`;
  },
  checkVoice: (interaction) => {
    const VC = interaction.member.voice.channel;

    if (!VC)
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            "🔹 | You need to be in a voice channel to use this command."
          ),
        ],
        ephemeral: true,
      });

    if (
      interaction.guild.members.me.voice.channelId &&
      VC.id !== interaction.guild.members.me.voice.channelId
    )
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            `🔹 | Sorry but I'm already playing music in <#${interaction.guild.members.me.voice.channelId}>.`
          ),
        ],
        ephemeral: true,
      });
  },
  isSongPlaying: (interaction, player) => {
<<<<<<< Updated upstream
    if (!player.playing)
=======
    if (!player.isPlaying)
>>>>>>> Stashed changes
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription(
            "🔹 | I'm not playing anything right now."
          ),
        ],
<<<<<<< Updated upstream
=======
        ephemeral: true,
>>>>>>> Stashed changes
      });
  },
  checkForQueue: (interaction, player) => {
    if (player.queue.length === 0)
      return interaction.editReply({
        embeds: [embed.setDescription("🔹 | There is nothing in the queue.")],
      });
  },
  repeatMode: async (mode, player, interaction) => {
    switch (mode) {
      case "queue":
<<<<<<< Updated upstream
        await player.setLoop("queue");

        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Repeat mode is now on. (Queue)")],
        });
      case "song":
        await player.setLoop("track");

        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Repeat mode is now on. (Song)")],
        });
      case "none":
        await player.setLoop("off");
=======
        if (!player.loop === 1) {
          await player.QueueRepeat();

          return interaction.editReply({
            embeds: [
              embed.setDescription("🔹 | Repeat mode is now on. (Queue)"),
            ],
          });
        }

        await player.DisableRepeat();
        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Repeat mode is now off.")],
        });

      case "song":
        if (!player.loop === 0) {
          await player.TrackRepeat();

          return interaction.editReply({
            embeds: [
              embed.setDescription("🔹 | Repeat mode is now on. (Song)"),
            ],
          });
        }

        await player.DisableRepeat();
>>>>>>> Stashed changes

        return interaction.editReply({
          embeds: [embed.setDescription("🔹 | Repeat mode is now off.")],
        });
    }
  },
  seek: async (interaction, player, time) => {
<<<<<<< Updated upstream
    const seekDuration = Number(time) * 1000;
    const duration = player.queue.current.length;

    if (seekDuration <= duration) {
      await player.shoukaku.seekTo(seekDuration);
=======
    const seekDuration = time * 1000;
    const duration = player.currentTrack.length;

    if (!player.currentTrack.isSeekable)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | This track isn't seekable.")
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    if (seekDuration <= duration) {
      await player.seekTo(seekDuration);
>>>>>>> Stashed changes

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Seeked to ${pms(seekDuration)}.`)
            .setTimestamp(),
        ],
      });
    }

    if (seekDuration > duration)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Invalid seek time.`)
            .setTimestamp(),
        ],
      });
  },
  setVolume: async (interaction, player, volume) => {
<<<<<<< Updated upstream
    if (volume < 0 || volume > 100)
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            "🔹| You can only set the volume from 0 to 100."
=======
    if (volume < 0 || volume > 5)
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            "🔹| To protect your ears from extreme audio distortion, we have limited the volume to up to 5%."
>>>>>>> Stashed changes
          ),
        ],
        ephemeral: true,
      });

<<<<<<< Updated upstream
    await player.setVolume(volume);
=======
    player.setVolume(volume);
>>>>>>> Stashed changes

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
<<<<<<< Updated upstream
            `🔹 | Volume has been set to **${player.volume * 100}%**.`
=======
            `🔹 | Volume has been set to **${player.filters.volume}%**.`
>>>>>>> Stashed changes
          )
          .setFooter({
            text: `Action executed by ${interaction.user.username}.`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          }),
      ],
    });
  },
};
