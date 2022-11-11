const { SlashCommandBuilder } = require("discord.js");

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
    ),
};
