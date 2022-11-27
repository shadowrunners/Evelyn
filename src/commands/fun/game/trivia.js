const { ChatInputCommandInteraction } = require("discord.js");
const { Trivia } = require("gamecord-extended");

module.exports = {
  subCommand: "game.trivia",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return new Trivia({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Trivia",
        color: "#5865F2",
        description: "You have 60 seconds to guess the answer.",
      },
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      trueButtonStyle: "SUCCESS",
      falseButtonStyle: "DANGER",
      mode: "multiple",
      difficulty: "medium",
      embed: {
        title: "Trivia",
        description: "You have {time} seconds to respond!",
        color: "#5865F2",
        winMessage: "GG, Your answer was correct! It was **{answer}**.",
        loseMessage:
          "Your answer was incorrect! The correct answer was **{answer}**.",
        othersMessage: "You are not allowed to use buttons for this message!",
      },
    }).startGame();
  },
};
