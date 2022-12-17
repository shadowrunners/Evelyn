const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = class Util {
  constructor(interaction) {
    this.interaction = interaction;
  }

  /** Turns several embeds into pages. */
  async embedPages(embeds) {
    const pages = {};
    const getRow = (id) => {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("◀")
          .setCustomId("prev_embed")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pages[id] === 0),

        new ButtonBuilder()
          .setLabel("▶")
          .setCustomId("next_embed")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pages[id] === embeds.length - 1)
      );
      return row;
    };

    const id = this.interaction.user.id;
    pages[id] = pages[id] || 0;
    const Pagemax = embeds.length;

    const filter = (i) => i.user.id === this.interaction.user.id;
    const time = 1000 * 60 * 5;

    const collector = await this.interaction.createMessageComponentCollector({
      filter,
      time,
    });

    const updateEmbed = async () => {
      await embeds[pages[id]].setFooter({
        text: `Page ${pages[id] + 1} from ${Pagemax}`,
      });

      await interaction.editReply({
        embeds: [embeds[pages[id]]],
        components: [getRow(id)],
        fetchReply: true,
      });
    };

    await updateEmbed();

    collector.on("collect", async (b) => {
      if (!b) return;
      if (b.customId !== "prev_embed" && b.customId !== "next_embed") return;

      b.deferUpdate();

      if (b.customId === "prev_embed" && pages[id] > 0) --pages[id];
      else if (b.customId === "next_embed" && pages[id] < embeds.length - 1)
        ++pages[id];

      await updateEmbed();
    });
  }

  switchTo(val) {
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
      default:
        break;
    }
    return status;
  }

  check4Perms(command) {
    if (
      !this.interaction.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPermissions)
      )
    ) {
      const permission = PermissionsBitField.resolve(command.botPermissions);

      return this.interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Missing Permissions")
            .setDescription(
              `🔹 | I'm missing several permissions, might wanna have a look at that.`
            )
            .addFields({
              name: "Permissions Missing",
              value: `${permission}`,
            }),
        ],
        ephemeral: true,
      });
    }
  }
};
