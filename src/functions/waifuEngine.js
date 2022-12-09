const { get } = require("superagent");
const { EmbedBuilder } = require("discord.js");

module.exports = class WaifuEngine {
  constructor() {
    /** API URL. */
    this.apiURL = "https://api.waifu.pics/sfw/";
    /** Base embed used to reduce repeated code. */
    this.embed = new EmbedBuilder()
      .setColor("Blurple")
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setTimestamp();
  }

  /** Retrieves the image from the endpoint provided. */
  async fetchImage(endpoint) {
    const { body } = await get(`${this.apiURL}${endpoint}`);
    return body.url;
  }

  /** Checks for a target user to display in the embed whenever a person needs to be mentioned. */
  checkTarget(target, interaction) {
    if (!target)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription(
            "🔹 | You forgot to provide a user."
          ),
        ],
        ephemeral: true,
      });
  }

  /** Fetches the biting images from the API and replies with an embed of it. */
  async bite(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("bite").then((image) => {
      return interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} bites ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches blushing images from the API and replies with an embed of it. */
  async blush(interaction) {
    await this.fetchImage("blush").then((image) => {
      return interaction.editReply({
        embeds: [
          embed
            .setAuthor({
              name: `${interaction.user.username} blushes`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }
};
