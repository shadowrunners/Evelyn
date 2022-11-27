const { ChatInputCommandInteraction } = require("discord.js");
const { WouldYouRather } = require("gamecord-extended");

module.exports = {
  subCommand: "game.wouldyourather",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new WouldYouRather({
      interaction: interaction,
    }).startGame();
  },
};
