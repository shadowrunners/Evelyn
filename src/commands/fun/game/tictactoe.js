const { ChatInputCommandInteraction } = require("discord.js");
const { TicTacToe } = require("gamecord-extended");

module.exports = {
  subCommand: "game.tictactoe",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { options } = interaction;

    return new TicTacToe({
      interaction: interaction,
      opponent: options.getUser("friend"),
    }).startGame();
  },
};
