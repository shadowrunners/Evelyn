/**
 * This class contains our own custom version of a wrapper for the NekoBot API to reduce the amount of packages we're using.
 * This bares a lot of resemblence to the waifu.pics API wrapper we use in our /actions system but this one is tailored to the API we mentioned earlier.
 */
const { get } = require("superagent");
const { EmbedBuilder } = require("discord.js");

module.exports = class NekoAPI {
  /** Creates a new instance of the NekoAPI class. */
  constructor(interaction) {
    /** API URL for the NekoBot API. */
    this.apiURL = "https://nekobot.xyz/api/imagegen";
    /** Base embed used to reduce repeated code. */
    this.embed = new EmbedBuilder()
      .setColor("Blurple")
      .setFooter({
        text: "This image was brought to you by the NekoBot API.",
      })
      .setTimestamp();
    /** The interaction object used for replying and fetching usernames. */
    this.interaction = interaction;

    this.user1 = null;
    this.user2 = null;
  }

  /** Retrieves the image from the endpoint provided. */
  async fetchImage(endpoint) {
    const { body } = await get(`${this.apiURL}${endpoint}`);
    return body.message;
  }

  /** Checks for a target user to display in the embed whenever a person needs to be mentioned. */
  checkTarget(user1, user2) {
    this.target1 = user1;
    this.target2 = user2;

    if (!this.target1)
      return this.interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription(
            "🔹 | You forgot to provide a user."
          ),
        ],
        ephemeral: true,
      });
  }

  /** Checks for a text string before displaying in the embed whenever a person needs to be mentioned. */
  checkText(text) {
    this.text = text;

    if (!text)
      return this.interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription(
            "🔹 | You forgot to provide some text."
          ),
        ],
        ephemeral: true,
      });
  }

  /** Fetches the awooified image from the API and replies with an embed of it. */
  async awooify(user1, user2) {
    if (this.checkTarget(user1, user2)) return;

    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=awooify&url=${this.user1.avatarURL() || this.user2.avatarURL()}`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the baguette image from the API and replies with an embed of it. */
  async baguette(user1, user2) {
    if (this.checkTarget(user1, user2)) return;

    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=baguette&url=${this.user1.avatarURL() || this.user2.avatarURL()}`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the blurpified image from the API and replies with an embed of it. */
  async blurpify(user1, user2) {
    if (this.checkTarget(user1, user2)) return;

    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=blurpify&image=${this.user1.avatarURL() || this.user2.avatarURL()}`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the captcha image from the API and replies with an embed of it. */
  async captcha(user1, user2) {
    if (this.checkTarget(user1, user2)) return;

    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=captcha&url=${
        this.user1.avatarURL() || this.user2.avatarURL()
      }&username=${this.user1.username || this.user2.username}`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the change my mind image from the API and replies with an embed of it. */
  async changemymind(text) {
    if (this.checkText(text)) return;
    this.text = text;

    await this.fetchImage(`?type=changemymind&text=${this.text}`).then(
      (image) => {
        return this.interaction.editReply({
          embeds: [embed.setImage(image)],
        });
      }
    );
  }

  /** Fetches the deepfried image from the API and replies with an embed of it. */
  async deepfry(user1, user2) {
    if (this.checkTarget(user1, user2)) return;

    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=deepfry&image=${this.user1.avatarURL() || this.user2.avatarURL()}`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the kanna image from the API and replies with an embed of it. */
  async kannagen(text) {
    if (this.checkText(text)) return;
    this.text = text;

    await this.fetchImage(`?type=kannagen&text=${this.text}`).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the PH image from the API and replies with an embed of it. */
  async phcomment(user1, user2) {
    if (this.checkTarget(user1, user2)) return;
    if (this.checkText(text)) return;

    this.text = text;
    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=phcomment&username=${
        this.user1.username || this.user2.username
      }&image=${this.user1.avatarURL() || this.user2.avatarURL()}&text=${
        this.text
      }`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the threats image from the API and replies with an embed of it. */
  async threats(user1, user2) {
    if (this.checkTarget(user1, user2)) return;

    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=threats&url=${this.user1.avatarURL() || this.user2.avatarURL()}`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the trash image from the API and replies with an embed of it. */
  async trash(user1, user2) {
    if (this.checkTarget(user1, user2)) return;

    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=trash&image=${this.user1.avatarURL() || this.user2.avatarURL()}`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }

  /** Fetches the trump tweet image from the API and replies with an embed of it. */
  async trumptweet(text) {
    if (this.checkText(text)) return;

    this.text = text;

    await this.fetchImage(`?type=trumptweet&text=${this.text}`).then(
      (image) => {
        return this.interaction.editReply({
          embeds: [embed.setImage(image)],
        });
      }
    );
  }

  /** Fetches the tweet image from the API and replies with an embed of it. */
  async tweet(user1, user2, text) {
    if (this.checkTarget(user1, user2)) return;

    this.text = text;
    this.user1 = user1;
    this.user2 = user2;

    await this.fetchImage(
      `?type=tweet&username=${
        this.user1.username || this.user2.username
      }&text=${this.text}`
    ).then((image) => {
      return this.interaction.editReply({
        embeds: [embed.setImage(image)],
      });
    });
  }
};
