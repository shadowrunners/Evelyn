const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { validateTrack } = require("../../../functions/playlistUtils.js");
const PDB = require("../../../structures/schemas/playlist.js");

module.exports = {
  subCommand: "playlist.removesong",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, user } = interaction;
    const pName = options.getString("name");
    const song = options.getNumber("songid");

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
  },
};
