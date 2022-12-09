const { ChatInputCommandInteraction } = require("discord.js");
const importEngine = require("../../../functions/playlistEngine.js");

module.exports = {
  subCommand: "playlist.removesong",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, user } = interaction;
    const pName = options.getString("name");
    const song = options.getNumber("songid");
    const PlaylistEngine = new importEngine(interaction);

    return PlaylistEngine.removeThisSong(pName, song);
  },
};
