const { ChatInputCommandInteraction } = require("discord.js");
const { removeTrack } = require("../../../engines/PLEngine.js");

module.exports = {
  subCommand: "playlist.removesong",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const pName = options.getString("name");
    const song = options.getNumber("songid");

    return removeTrack(interaction, pName, song);
  },
};
