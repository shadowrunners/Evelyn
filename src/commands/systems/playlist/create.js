const { ChatInputCommandInteraction } = require("discord.js");
const { createPlaylist } = require("../../../engines/PLEngine.js");

module.exports = {
  subCommand: "playlist.create",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const pName = options.getString("name");

    return createPlaylist(interaction, pName);
  },
};
