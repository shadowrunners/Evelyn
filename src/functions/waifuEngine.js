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
    this.target = target;
    this.interaction = interaction;

    if (!this.target)
      return this.interaction.editReply({
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
      return this.interaction.editReply({
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
      return this.this.interaction.editReply({
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

  /** Fetches bonk images from the API and replies with an embed of it. */
  async bonk(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("bonk").then((image) => {
      return this.this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} bonks ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches bully images from the API and replies with an embed of it. */
  async bully(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("bully").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} bullies ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches cringe images from the API and replies with an embed of it. */
  async cringe(interaction) {
    await this.fetchImage("cringe").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} thinks that's pretty cringe`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches crying images from the API and replies with an embed of it. */
  async cry(interaction) {
    await this.fetchImage("cry").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} is crying :c`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches cuddling images from the API and replies with an embed of it. */
  async cuddle(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("cuddle").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} cuddles ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches handholding images from the API and replies with an embed of it. */
  async handhold(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("handhold").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} is holding ${target.username}'s hand`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches highfive images from the API and replies with an embed of it. */
  async highfive(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("highfive").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} highfives ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches hugging images from the API and replies with an embed of it. */
  async hug(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("hug").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} hugs ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches kissing images from the API and replies with an embed of it. */
  async kiss(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("kiss").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} kisses ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches patting images from the API and replies with an embed of it. */
  async pat(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("pat").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} pats ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches poking images from the API and replies with an embed of it. */
  async poke(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("poke").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} blushes`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches slapping images from the API and replies with an embed of it. */
  async slap(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("slap").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} slaps ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches waving images from the API and replies with an embed of it. */
  async wave(target, interaction) {
    if (this.checkTarget(target, interaction)) return;

    await this.fetchImage("wave").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${interaction.user.username} waves at ${target.username}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }
};
