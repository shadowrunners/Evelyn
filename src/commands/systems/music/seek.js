const { ChatInputCommandInteraction, Client } = require("discord.js");
const { seek, checkVoice } = require("../../../utils/musicUtils.js");

module.exports = {
  subCommand: "music.seek",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;

    const player = client.manager.players.get(guildId);
    await interaction.deferReply();

    if (!player) return;
    if (await checkVoice(interaction)) return;

    const time = options.getNumber("time");
    return seek(interaction, track, time);
  },
};
