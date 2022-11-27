const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const {
  checkVoice,
  checkForQueue,
} = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.shuffle",
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

    await player.queue.shuffle();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("🔹 | Shuffled.")
          .setTimestamp(),
      ],
    });
  },
};
