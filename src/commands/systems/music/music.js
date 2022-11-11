const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  botPermissions: ["SendMessages", "EmbedLinks", "Connect", "Speak"],
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("A complete music system.")
    .addSubcommand((options) =>
      options
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Provide the name of the song or URL.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("volume")
        .setDescription("Alter the volume.")
        .addNumberOption((option) =>
          option
            .setName("percent")
            .setDescription("Provide the volume.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("seek")
        .setDescription("Skip to a specific time in the song.")
        .addNumberOption((option) =>
          option
            .setName("time")
            .setDescription("Provide the timestamp.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("repeat")
        .setDescription("Repeat the current song or queue.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Select the loop type.")
            .setRequired(true)
            .addChoices(
              { name: "🔹 | Queue", value: "queue" },
              { name: "🔹 | Song", value: "song" },
              { name: "🔹 | Off", value: "off" }
            )
        )
    )
    .addSubcommand((options) =>
      options
        .setName("settings")
        .setDescription("Select an option.")
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription("Select an option.")
            .setRequired(true)
            .addChoices(
              { name: "🔹 | View Queue", value: "queue" },
              { name: "🔹 | Clear Queue", value: "queueclear" },
              { name: "🔹 | Skip", value: "skip" },
              { name: "🔹 | Pause", value: "pause" },
              { name: "🔹 | Resume", value: "resume" },
              { name: "🔹 | Stop", value: "stop" },
              { name: "🔹 | Lyrics", value: "lyrics" },
              { name: "🔹 | Shuffle", value: "shuffle" },
              { name: "🔹 | Now Playing", value: "nowplaying" }
            )
        )
    ),
};
