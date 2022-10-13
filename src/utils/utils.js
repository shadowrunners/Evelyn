const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

async function embedPages(interaction, embeds) {
  const pages = {};
  const getRow = (id) => {
    const row = new ActionRowBuilder();

    row.addComponents(
      new ButtonBuilder()
        .setLabel("◀")
        .setCustomId("prev_embed")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages[id] === 0)
    );

    row.addComponents(
      new ButtonBuilder()
        .setLabel("▶")
        .setCustomId("next_embed")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages[id] === embeds.length - 1)
    );
    return row;
  };

  const id = interaction.user.id;
  pages[id] = pages[id] || 0;
  const Pagemax = embeds.length;

  const embed = embeds[pages[id]];

  await embeds[pages[id]].setFooter({
    text: `Page ${pages[id] + 1} from ${Pagemax}`,
  });

  const replyEmbed = await interaction.editReply({
    embeds: [embed],
    components: [getRow(id)],
    fetchReply: true,
  });

  const filter = (i) => i.user.id === interaction.user.id;
  const time = 1000 * 60 * 5;

  const collector = await replyEmbed.createMessageComponentCollector({
    filter,
    time,
  });

  collector.on("collect", async (b) => {
    if (!b) return;
    if (b.customId !== "prev_embed" && b.customId !== "next_embed") return;

    b.deferUpdate();

    if (b.customId === "prev_embed" && pages[id] > 0) {
      --pages[id];
    } else if (b.customId === "next_embed" && pages[id] < embeds.length - 1) {
      ++pages[id];
    }

    await embeds[pages[id]].setFooter({
      text: `Page ${pages[id] + 1} of ${Pagemax}`,
    });

    await interaction.editReply({
      embeds: [embeds[pages[id]]],
      components: [getRow(id)],
      fetchReply: true,
    });
  });
}

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

function unique(arr1, arr2) {
  const unique1 = arr1.filter((z) => arr2.indexOf(z) === -1);
  const unique2 = arr2.filter((z) => arr1.indexOf(z) === -1);

  const unique = unique1.concat(unique2);
  return unique;
}

function isSongPlaying(player) {
  if (player.playing) return;
  if (!player.playing)
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("🔹 | I'm not playing anything right now.")
          .setTimestamp(),
      ],
    });
}

function checkForQueue(player) {
  if (player.queue.length > 1) return;
  if (!player.queue.length < 1)
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("🔹 | There is nothing in the queue.")
          .setTimestamp(),
      ],
    });
}

async function repeatMode(mode, player) {
  switch (mode) {
    case "queue":
      checkForQueue(player);
      await player.setLoop("queue");

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | Repeat mode is now on. (Queue)")
            .setTimestamp(),
        ],
      });
    case "song":
      isSongPlaying(player);
      await player.setLoop("song");

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | Repeat mode is now on. (Song)")
            .setTimestamp(),
        ],
      });
    case "none":
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

function switchTo(val) {
  let status = " ";
  switch (val) {
    case 0:
      status = "🟥 Disconnected";
      break;
    case 1:
      status = `🔷 Connected`;
      break;
    case 2:
      status = `🟨 Connecting`;
      break;
    case 3:
      status = `🟨 Disconnecting`;
      break;
  }
  return status;
}

module.exports = {
  embedPages,
  progressbar,
  unique,
  switchTo,
  isSongPlaying,
  checkForQueue,
  repeatMode,
};
