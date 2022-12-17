const { ChatInputCommandInteraction, Client } = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.filters",
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
      case "3d":
        return utils.filters("3d");
      case "bass":
        return utils.filters("bass");
      case "bassboost":
        return utils.filters("bassboost");
      case "nightcore":
        return utils.filters("nightcore");
      case "pop":
        return utils.filters("pop");
      case "slowmo":
        return utils.filters("slowmo");
      case "soft":
        return utils.filters("soft");
      case "tv":
        return utils.filters("tv");
      case "treblebass":
        return utils.filters("treblebass");
      case "tremolo":
        return utils.filters("tremolo");
      case "vaporwave":
        return utils.filters("vaporwave");
      case "vibrate":
        return utils.filters("vibrate");
      case "vibrato":
        return utils.filters("vibrato");
      case "reset":
        return utils.filters("reset");
      default:
        break;
    }
  },
};
