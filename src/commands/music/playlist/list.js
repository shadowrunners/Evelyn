const { ChatInputCommandInteraction } = require("discord.js");
const importEngine = require("../../../functions/playlistEngine.js");

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
