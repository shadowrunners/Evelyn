const { ChatInputCommandInteraction, Client } = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.repeat",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;
    const player = client.manager.players.get(guildId);
    const utils = new MusicUtils(interaction, player);
    await interaction.deferReply();

    if (utils.check()) return;

    switch (options.getString("type")) {
      case "queue":
        return utils.repeatMode("queue");
      case "song":
        return utils.repeatMode("song");
      case "off":
        return utils.repeatMode("off");
      default:
        break;
    }
  },
};
