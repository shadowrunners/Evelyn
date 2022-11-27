const { ChatInputCommandInteraction, Client } = require("discord.js");
const {
  setVolume,
  isSongPlaying,
  checkVoice,
} = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.volume",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;

    const player = client.manager.players.get(guildId);
    const percent = options.getNumber("percent");

    await interaction.deferReply();

    if (!player) return;
    if (await isSongPlaying(interaction, player)) return;
    if (await checkVoice(interaction)) return;

    return setVolume(interaction, player, percent);
  },
};