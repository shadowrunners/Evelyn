const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { checkVoice, checkForQueue } = require("../../../utils/musicUtils.js");

module.exports = {
  subCommand: "music.clear",
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
    if (checkForQueue(interaction, player)) return;

    player.queue.clear();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("🔹 | Queue cleared.")
          .setTimestamp(),
      ],
    });
  },
};
