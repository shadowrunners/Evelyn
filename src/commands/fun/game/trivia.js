const { ChatInputCommandInteraction } = require("discord.js");
const { Trivia } = require("gamecord-extended");

module.exports = {
  subCommand: "game.trivia",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new Trivia({
      interaction: interaction,
    }).startGame();
  },
};
