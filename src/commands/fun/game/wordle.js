const { ChatInputCommandInteraction } = require("discord.js");
const { Wordle } = require("gamecord-extended");

module.exports = {
  subCommand: "game.wordle",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new Wordle({
      interaction: interaction,
    }).startGame();
  },
};
