const { ChatInputCommandInteraction } = require("discord.js");
const { Snake } = require("gamecord-extended");

module.exports = {
  subCommand: "game.snake",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new Snake({
      interaction: interaction,
    }).startGame();
  },
};
