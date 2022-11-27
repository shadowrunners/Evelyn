const { ChatInputCommandInteraction } = require("discord.js");
const { FindEmoji } = require("gamecord-extended");

module.exports = {
  subCommand: "game.findemoji",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new FindEmoji({
      interaction: interaction,
      timeoutTime: 60000,
    }).startGame();
  },
};
