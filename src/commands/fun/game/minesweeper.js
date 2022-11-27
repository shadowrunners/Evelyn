const { ChatInputCommandInteraction } = require("discord.js");
const { Minesweeper } = require("gamecord-extended");

module.exports = {
  subCommand: "game.minesweeper",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new Minesweeper({
      interaction: interaction,
    }).startGame();
  },
};
