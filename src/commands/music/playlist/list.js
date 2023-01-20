const { ChatInputCommandInteraction } = require("discord.js");
const importEngine = require('../../../modules/Engines/playlistEngine.js');

module.exports = {
  subCommand: "playlist.list",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const PlaylistEngine = new importEngine(interaction);
    await interaction.deferReply();

    return PlaylistEngine.list();
  },
};
