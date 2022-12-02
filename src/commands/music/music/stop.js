const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { checkVoice } = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.stop",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guildId } = interaction;

    const player = client.manager.players.get(guildId);
    await interaction.deferReply();

    if (!player) return;
    if (await checkVoice(interaction)) return;

    await player.destroy();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("🔹 | Disconnected.")
          .setTimestamp(),
      ],
    });
  },
};
