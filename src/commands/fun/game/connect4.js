const { ChatInputCommandInteraction } = require("discord.js");
const { Connect4 } = require("gamecord-extended");

module.exports = {
  subCommand: "game.connect4",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { options } = interaction;

    return new Connect4({
      interaction: interaction,
      opponent: options.getUser("friend"),
    }).startGame();
  },
};
