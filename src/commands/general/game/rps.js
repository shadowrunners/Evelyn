const { ChatInputCommandInteraction } = require("discord.js");
const { RockPaperScissors } = require("gamecord-extended");

module.exports = {
  subCommand: "game.rps",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new RockPaperScissors({
      interaction: interaction,
      opponent: options.getUser("friend"),
      embed: {
        title: "Rock Paper Scissors",
        description: "Press a button below to make a choice!",
        color: "#5865F2",
      },
      buttons: {
        rock: "Rock",
        paper: "Paper",
        scissors: "Scissors",
      },
      emojis: {
        rock: "🌑",
        paper: "📃",
        scissors: "✂️",
      },
      othersMessage:
        "🔹 | You are not allowed to use the buttons of this message!",
      chooseMessage: "🔹 | You chose {emoji}!",
      noChangeMessage: "🔹 | You cannot change your selection!",
      askMessage:
        "🔹 | Hey {opponent}, {challenger} has challenged you to a game of Rock, Paper, Scissors!",
      cancelMessage:
        "🔹 | Looks like they refused to play a game of Rock Paper Scissors. :(",
      timeEndMessage:
        "🔹 | Since the opponent didn't answer in time, the match was cancelled.",
      drawMessage: "🔹 | It was a draw!",
      winMessage: "🍾 **{winner} won the game!** 🍾",
      gameEndMessage: "🔹 | The game has gone unfinished. :(",
    }).startGame();
  },
};
