const { EmbedBuilder } = require("discord.js");
const pms = require("pretty-ms");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

function progressbar(player) {
  const size = 15;
  const line = "▬";
  const slider = "🔘";

  if (!player.queue.current) return `${slider}${line.repeat(size - 1)}]`;
  const current =
    player.queue.current.length !== 0
      ? player.shoukaku.position
      : player.queue.current.length;
  const total = player.queue.current.length;
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

  if (!String(bar).includes(slider)) return `${slider}${line.repeat(size - 1)}`;
  return `${bar[0]}`;
}

async function checkVoice(interaction) {
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
}

function isSongPlaying(interaction, player) {
  if (!player.playing)
    return interaction.editReply({
      embeds: [
        new EmbedBuilder().setDescription(
          "🔹 | I'm not playing anything right now."
        ),
      ],
    });
}

function checkForQueue(interaction, player) {
  if (player.queue.length === 0)
    return interaction.editReply({
      embeds: [embed.setDescription("🔹 | There is nothing in the queue.")],
    });
}

async function repeatMode(mode, player, interaction) {
  switch (mode) {
    case "queue":
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

      return interaction.editReply({
        embeds: [embed.setDescription("🔹 | Repeat mode is now off.")],
      });
  }
}

async function seek(interaction, player, time) {
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
}

async function setVolume(interaction, player, volume) {
  if (volume < 0 || volume > 100)
    return interaction.editReply({
      embeds: [
        embed.setDescription("🔹| You can only set the volume from 0 to 100."),
      ],
      ephemeral: true,
    });

  await player.setVolume(volume);

  return interaction.editReply({
    embeds: [
      embed
        .setDescription(
          `🔹 | Volume has been set to **${player.volume * 100}%**.`
        )
        .setFooter({
          text: `Action executed by ${interaction.user.username}.`,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        }),
    ],
  });
}

module.exports = {
  progressbar,
  checkForQueue,
  isSongPlaying,
  repeatMode,
  checkVoice,
  setVolume,
  seek,
};
