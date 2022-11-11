const { ChatInputCommandInteraction } = require("discord.js");
const { TicTacToe } = require("gamecord-extended");

module.exports = {
  subCommand: "game.tictactoe",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new TicTacToe({
      interaction: interaction,
      opponent: options.getUser("friend"),
      embed: {
        title: "Tic Tac Toe",
        overTitle: "Game over!",
        color: "#5865F2",
      },
      oEmoji: "🔵",
      xEmoji: "❌",
      blankEmoji: "➖",
      oColor: "Primary",
      xColor: "Danger",
      waitMessage: "🔹 | Waiting for your opponent.",
      turnMessage: "🔹 | It's now **{player}**'s turn.",
      winMessage: "🍾 **{winner} won the game!** 🍾",
      gameEndMessage: "🔹 | The game has gone unfinished. :(",
      drawMessage: "🔹 | It's a draw!",
      askMessage:
        "🔹 | Hey {opponent}, {challenger} has challenged you to a game of Tic Tac Toe!",
      cancelMessage:
        "🔹 | Looks like they refused to play a game of Tic Tac Toe with you. :(",
      timeEndMessage:
        "🔹 | Since the opponent didn't answer in time, the match was cancelled.",
    }).startGame();
  },
};
