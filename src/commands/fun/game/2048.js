const { ChatInputCommandInteraction } = require("discord.js");
const { TwentyFortyEight } = require("gamecord-extended");

module.exports = {
  subCommand: "game.2048",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new TwentyFortyEight({
      interaction: interaction,
      timeoutTime: 60000,
      playerOnlyMessage: "Only {player} can use these buttons.",
    }).startGame();
  },
};
