const { ChatInputCommandInteraction } = require("discord.js");
const importEngine = require('../../../modules/Engines/playlistEngine.js');

module.exports = {
  subCommand: "playlist.create",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const pName = options.getString("name");
    const PlaylistEngine = new importEngine(interaction);

    await interaction.deferReply();

    return PlaylistEngine.create(pName);
  },
};
