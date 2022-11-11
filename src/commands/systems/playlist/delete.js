const { ChatInputCommandInteraction } = require("discord.js");
const { deletePlaylist } = require("../../../engines/PLEngine.js");

module.exports = {
  subCommand: "playlist.delete",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const pName = options.getString("name");

    return deletePlaylist(interaction, pName);
  },
};
