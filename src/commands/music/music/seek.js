const { ChatInputCommandInteraction, Client } = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.seek",
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

    const time = options.getNumber("time");
    return utils.seek(time);
  },
};
