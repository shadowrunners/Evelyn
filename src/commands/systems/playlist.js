const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
} = require("discord.js");
const {
  createPlaylist,
  deletePlaylist,
  addCurrent,
  showPlaylistTracks,
  showAllPlaylists,
  removeTrack,
} = require("../../engines/PLEngine.js");

module.exports = {
  botPermissions: ["SendMessages", "EmbedLinks"],
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("So.. playlists?")
    .addSubcommand((options) =>
      options
        .setName("create")
        .setDescription("Create a new playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name for the playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("delete")
        .setDescription("Delete your saved playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name of the playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("addcurrent")
        .setDescription("Add the currently playing song to the playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name of the playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("info")
        .setDescription("Lists the tracks of the provided playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name of the playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options.setName("list").setDescription("Lists all your playlists.")
    )
    .addSubcommand((options) =>
      options
        .setName("removesong")
        .setDescription("Removes a song from your playlist.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Provide a name of the playlist.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("songid")
            .setDescription("Provide the number of the song.")
            .setRequired(true)
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;
    const player = client.manager.players.get(guildId);

    await interaction.deferReply();

    let pName;
    let song;

    try {
      switch (options.getSubcommand()) {
        case "create":
          pName = options.getString("name");
          return createPlaylist(interaction, pName);

        case "delete":
          pName = options.getString("name");
          return deletePlaylist(interaction, pName);

        case "addcurrent":
          pName = options.getString("name");
          return addCurrent(interaction, player, pName);

        case "info":
          pName = options.getString("name");
          return showPlaylistTracks(client, interaction, pName);

        case "list":
          return showAllPlaylists(client, interaction);

        case "removesong":
          pName = options.getString("name");
          song = options.getNumber("songid");
          return removeTrack(interaction, pName, song);
      }
    } catch (e) {
      console.log(e);
    }
  },
};
