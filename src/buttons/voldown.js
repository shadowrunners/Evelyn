const client = require("../structures/index.js");
const { ButtonInteraction } = require("discord.js");
const MusicUtils = require("../functions/musicUtils.js");

module.exports = {
  id: "voldown",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { guildId } = interaction;

    const player = client.manager.players.get(guildId);
    const volume = Number(player.volume * 100) - 10;
    const utils = new MusicUtils(interaction, player);

    await interaction.deferReply();

    if (utils.check()) return;

    return utils.setVolume(volume);
  },
};
