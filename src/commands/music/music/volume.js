const { ChatInputCommandInteraction, Client } = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.volume",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;
    const utils = new MusicUtils(interaction, player);

    const player = client.manager.players.get(guildId);
    const percent = options.getNumber("percent", true);

    await interaction.deferReply();

    if (utils.check()) return;

    return setVolume(percent);
  },
};
