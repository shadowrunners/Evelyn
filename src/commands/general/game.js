const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const {
  EightBall,
  Connect4,
  RockPaperScissors,
  Snake,
  TicTacToe,
  Trivia,
  WouldYouRather,
} = require("gamecord-extended");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("Play some games inside Discord!")
    .addSubcommand((option) =>
      option
        .setName("8ball")
        .setDescription("Ask a question to the almighty 8-ball.")
        .addStringOption((option) =>
          option
            .setName("question")
            .setDescription("Provide your question here.")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("connect4")
        .setDescription("Chill and play some Connect4 with your friends.")
        .addUserOption((option) =>
          option
            .setName("friend")
            .setDescription("Provide your friend here.")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("rps")
        .setDescription(
          "Destroy your friends in a match of the good ol' Rock Paper Scissors."
        )
        .addUserOption((option) =>
          option
            .setName("friend")
            .setDescription("Provide your friend here.")
            .setRequired(true)
        )
    )
    .addSubcommand((option) => option.setName("snake").setDescription("Snek."))
    .addSubcommand((option) =>
      option
        .setName("tictactoe")
        .setDescription("A certified hood classic.")
        .addUserOption((option) =>
          option
            .setName("friend")
            .setDescription("Provide your friend here.")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("trivia")
        .setDescription("Answer a random trivia question.")
    )
    .addSubcommand((option) =>
      option.setName("wouldyourather").setDescription("So.., would you rather?")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "8ball":
        return new EightBall({
          interaction: interaction,
          question: options.getString("question"),
        }).startGame();

      case "connect4":
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

      case "rps":
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

      case "snake":
        return new Snake({
          interaction: interaction,
          snake: { head: "🟢", body: "🟩", tail: "🟢", over: "💀" },
          emojis: {
            board: "⬛",
            food: "🍎",
            up: "⬆️",
            right: "➡️",
            down: "⬇️",
            left: "⬅️",
          },
          foods: ["🍎", "🍇", "🍊"],
        }).startGame();

      case "tictactoe":
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

      case "trivia":
        return new Trivia({
          interaction: interaction,
          embed: {
            description: "You have {time} seconds to respond!",
            color: "#5865F2",
            winMessage: "GG, Your answer was correct! It was **{answer}**.",
            loseMessage:
              "Your answer was incorrect! The correct answer was **{answer}**.",
            othersMessage:
              "You are not allowed to use buttons for this message!",
          },
        }).startGame();

      case "wouldyourather":
        return new WouldYouRather({
          interaction: interaction,
          thinkMessage: "**Thinking..**",
          buttons: { option1: "Option 1", option2: "Option 2" },
        }).startGame();
    }
  },
};
