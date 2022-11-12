const { ChatInputCommandInteraction } = require("discord.js");
const { EightBall } = require("gamecord-extended");

module.exports = {
  subCommand: "game.8ball",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { options } = interaction;

    return new EightBall({
      interaction: interaction,
      question: options.getString("question"),
    }).startGame();
  },
};
