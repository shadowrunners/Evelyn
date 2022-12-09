const { ChatInputCommandInteraction, Client } = require("discord.js");
const importEngine = require("../../../functions/playlistEngine.js");

module.exports = {
  subCommand: "playlist.addcurrent",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;
    const playlistName = options.getString("name");
    const player = client.manager.players.get(guildId);

    await interaction.deferReply();

    if (!player) return;

    const PlaylistEngine = new importEngine(interaction);
    return PlaylistEngine.addCurrentTrack(player, playlistName);
  },
};
