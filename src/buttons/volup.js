const { ButtonInteraction } = require("discord.js");
const { setVolume, isSongPlaying } = require("../modules/musicModule.js");
const client = require("../structures/index.js");

module.exports = {
  id: "volup",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const player = client.manager.players.get(interaction.guild.id);
    const volume = Number(player.volume * 100) + 10;

    await interaction.deferReply();

    if (!player) return;
    if (isSongPlaying(interaction, player)) return;

    return await setVolume(interaction, player, volume);
  },
};
