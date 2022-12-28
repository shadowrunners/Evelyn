const {
  Client,
  EmbedBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.shuffle",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    const player = client.manager.players.get(interaction.guildId);
    const musicUtils = new MusicUtils(interaction, player);
    await interaction.deferReply();

    if (musicUtils.check()) return;

    await player.queue.shuffle();

    return interaction.editReply({
      embeds: [embed.setDescription("🔹 | Shuffled.")],
    });
  },
};
