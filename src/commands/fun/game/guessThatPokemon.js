const { ChatInputCommandInteraction } = require("discord.js");
const { GuessThatPokemon } = require("gamecord-extended");

module.exports = {
  subCommand: "game.guessthatpokemon",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new GuessThatPokemon({
      interaction: interaction,
    }).startGame();
  },
};
