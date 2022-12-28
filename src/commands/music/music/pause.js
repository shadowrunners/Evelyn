const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.pause",
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
    if (musicUtils.checkPlaying()) return;
    await player.pause(true);

    return interaction.editReply({
      embeds: [embed.setDescription("🔹 | Paused.")],
    });
  },
};
