const { ChatInputCommandInteraction, Client } = require("discord.js");
const { showAllPlaylists } = require("../../../engines/PLEngine.js");

module.exports = {
  subCommand: "playlist.list",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    return showAllPlaylists(client, interaction);
  },
};
