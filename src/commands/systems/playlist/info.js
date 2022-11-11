const { ChatInputCommandInteraction, Client } = require("discord.js");
const { showPlaylistTracks } = require("../../../engines/PLEngine.js");

module.exports = {
  subCommand: "playlist.info",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const pName = options.getString("name");

    return showPlaylistTracks(client, interaction, pName);
  },
};
