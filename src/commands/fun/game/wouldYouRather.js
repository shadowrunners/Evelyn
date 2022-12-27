const { ChatInputCommandInteraction } = require("discord.js");
const { WouldYouRather } = require("gamecord-extended");

module.exports = {
  subCommand: "game.wouldyourather",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction) {
    return new WouldYouRather({ interaction }).startGame();
  },
};
