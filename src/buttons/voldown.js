const { ButtonInteraction } = require("discord.js");
const { setVolume, isSongPlaying } = require("../functions/musicUtils.js");
const client = require("../structures/index.js");

module.exports = {
  id: "voldown",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const player = client.manager.players.get(interaction.guild.id);
    const volume = Number(player.filters.volume) - 1;

    await interaction.deferReply();

    if (!player) return;
    if (isSongPlaying(interaction, player)) return;

    return setVolume(interaction, player, volume);
  },
};
