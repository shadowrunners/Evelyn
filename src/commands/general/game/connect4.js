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
      waitMessage: "🔹 | Waiting for your opponent.",
      turnMessage: "🔹 | It's now **{player}**'s turn.",
      winMessage: "🍾 **{winner} won the game!** 🍾",
      gameEndMessage: "🔹 | The game has gone unfinished. :(",
      drawMessage: "🔹 | It's a draw!",
      othersMessage:
        "🔹 | You are not allowed to use the buttons of this message!",
      askMessage:
        "🔹 | Hey {opponent}, {challenger} has challenged you to a game of Connect 4!",
      cancelMessage:
        "🔹 | Looks like they refused to play a game of Connect4 with you. :(",
      timeEndMessage:
        "🔹 | Since the opponent didn't answer in time, the match was cancelled.",
    }).startGame();
  },
};
