const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { checkVoice, isSongPlaying } = require("../../../utils/musicUtils.js");

module.exports = {
  subCommand: "music.pause",
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
    if (isSongPlaying(interaction, player)) return;

    await player.pause(true);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("🔹 | Paused.")
          .setTimestamp(),
      ],
    });
  },
};
