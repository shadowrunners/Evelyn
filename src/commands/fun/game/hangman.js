const { ChatInputCommandInteraction } = require("discord.js");
const { Hangman } = require("gamecord-extended");

module.exports = {
  subCommand: "game.hangman",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const themes = [
      "nature",
      "sport",
      "color",
      "camp",
      "fruit",
      "discord",
      "winter",
      "pokemon",
    ];

    return new Hangman({
      interaction: interaction,
      theme: Math.floor(Math.random() * themes.length),
    }).startGame();
  },
};
