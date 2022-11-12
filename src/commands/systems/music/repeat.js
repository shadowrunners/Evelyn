const { ChatInputCommandInteraction, Client } = require("discord.js");
const {
  checkForQueue,
  isSongPlaying,
  checkVoice,
} = require("../../../utils/musicUtils.js");

module.exports = {
  subCommand: "music.repeat",
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

    switch (options.getString("type")) {
      case "queue":
        if (!checkForQueue(interaction, player)) return;
        return await repeatMode("queue", player, interaction);
      case "song":
        if (isSongPlaying(interaction, player)) return;
        return await repeatMode("song", player, interaction);
    }
  },
};
