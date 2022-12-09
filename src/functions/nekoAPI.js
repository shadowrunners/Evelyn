/**
 * This class contains our own custom version of a wrapper for the NekoBot API to reduce the amount of packages we're using.
 * This bares a lot of resemblence to the waifu.pics API wrapper we use in our /actions system but this one is tailored to the API we mentioned earlier.
 */
const { get } = require("superagent");
const { EmbedBuilder } = require("discord.js");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
const { checkUsername, checkText, checkAvatar } = require("./NekoHelper.js");

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
};
