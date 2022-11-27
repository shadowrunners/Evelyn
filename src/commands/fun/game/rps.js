const { ChatInputCommandInteraction } = require("discord.js");
const { RockPaperScissors } = require("gamecord-extended");

module.exports = {
  subCommand: "game.rps",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { options } = interaction;

    return new RockPaperScissors({
      interaction: interaction,
      opponent: options.getUser("friend"),
    }).startGame();
  },
};
