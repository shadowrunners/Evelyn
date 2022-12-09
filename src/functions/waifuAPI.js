/**
 * This class contains our own custom version of a wrapper for the waifu.pics API to reduce the amount of packages we're using.
 */
const { get } = require("superagent");
const { EmbedBuilder } = require("discord.js");

module.exports = class WaifuEngine {
  /** Creates a new instance of the Waifu Engine class. */
  constructor(interaction) {
    /** API URL for waifu.pics. */
    this.apiURL = "https://api.waifu.pics/sfw/";
    /** Base embed used to reduce repeated code. */
    this.embed = new EmbedBuilder()
      .setColor("Blurple")
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setTimestamp();
    /** The interaction object used for replying and fetching usernames. */
    this.interaction = interaction;
  }

  /** Retrieves the image from the endpoint provided. */
  async fetchImage(endpoint) {
    const { body } = await get(`${this.apiURL}${endpoint}`);
    return body.url;
  }

  /** Checks for a target user to display in the embed whenever a person needs to be mentioned. */
  checkTarget(target) {
    this.target = target;

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
  async bite(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("bite").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} bites ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches blushing images from the API and replies with an embed of it. */
  async blush() {
    await this.fetchImage("blush").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} blushes`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches bonk images from the API and replies with an embed of it. */
  async bonk(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("bonk").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} bonks ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches bully images from the API and replies with an embed of it. */
  async bully(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("bully").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} bullies ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches cringe images from the API and replies with an embed of it. */
  async cringe() {
    await this.fetchImage("cringe").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} thinks that's pretty cringe`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches crying images from the API and replies with an embed of it. */
  async cry() {
    await this.fetchImage("cry").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} is crying :c`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches cuddling images from the API and replies with an embed of it. */
  async cuddle(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("cuddle").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} cuddles ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches handholding images from the API and replies with an embed of it. */
  async handhold(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("handhold").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} is holding ${target.username}'s hand`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches highfive images from the API and replies with an embed of it. */
  async highfive(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("highfive").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} highfives ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches hugging images from the API and replies with an embed of it. */
  async hug(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("hug").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} hugs ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches kissing images from the API and replies with an embed of it. */
  async kiss(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("kiss").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} kisses ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches patting images from the API and replies with an embed of it. */
  async pat(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("pat").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} pats ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches poking images from the API and replies with an embed of it. */
  async poke(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("poke").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} blushes`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches slapping images from the API and replies with an embed of it. */
  async slap(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("slap").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} slaps ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }

  /** Fetches waving images from the API and replies with an embed of it. */
  async wave(target) {
    if (this.checkTarget(target)) return;

    await this.fetchImage("wave").then((image) => {
      return this.interaction.editReply({
        embeds: [
          this.embed
            .setAuthor({
              name: `${this.interaction.user.username} waves at ${target.username}`,
              iconURL: this.interaction.user.avatarURL({ dynamic: true }),
            })
            .setImage(image),
        ],
      });
    });
  }
};
