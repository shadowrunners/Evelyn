const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { checkVoice, isSongPlaying } = require("../../../utils/musicUtils.js");

module.exports = {
  subCommand: "music.skip",
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

    await player.stop();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("🔹 | Skipped.")
          .setTimestamp(),
      ],
    });
  },
};
