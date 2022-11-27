const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("Play some games inside Discord!")
    .addSubcommand((option) =>
      option
        .setName("2048")
        .setDescription(
          "Math but you add up squares to 2048 instead of doing hard equations."
        )
    )
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
      option.setName("findemoji").setDescription("Find the correct emoji.")
    )
    .addSubcommand((option) =>
      option.setName("guessthatpokemon").setDescription("Guess that pokemon!")
    )
    .addSubcommand((option) =>
      option.setName("hangman").setDescription("The classic version of Wordle.")
    )
    .addSubcommand((option) =>
      option.setName("minesweeper").setDescription("A certified hood classic.")
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
      option.setName("wordle").setDescription("Guess the word.")
    )
    .addSubcommand((option) =>
      option
        .setName("wouldyourather")
        .setDescription("So, would you rather use this command or pass by?")
    ),
};
