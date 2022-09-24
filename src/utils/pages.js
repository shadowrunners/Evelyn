const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  embedPages: async (client, interaction, embeds) => {
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
