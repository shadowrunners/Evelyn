const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  embedPages: async (interaction, embeds) => {
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
    let Pagemax = embeds.length;

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

    // -------------- Not needed --------------
    collector.on("end", async (reason) => {
      if (reason === "time") {
        const warningEmbed = new EmbedBuilder()
          .setColor("Yellow")
          .setDescription(`⚠️ |  Unfortunately, the embed has expired!`);

        await interaction.editReply({
          embeds: [warningEmbed],
          components: [],
          ephemeral: true,
        });
      }
    });
    // -------------- Not needed --------------
  },
};

async function progressbar(player) {
  let size = 15;
  let line = "▬";
  let slider = "🔘";

  if (!player.queue.current) return `${slider}${line.repeat(size - 1)}]`;
  let current =
    player.queue.current.length !== 0
      ? player.shoukaku.position
      : player.queue.current.length;
  let total = player.queue.current.length;
  let bar =
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

module.exports = { progressbar, unique };
