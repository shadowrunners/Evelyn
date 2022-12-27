const {
  Client,
  EmbedBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.skip",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    const player = client.manager.players.get(interaction.guildId);
    const utils = new MusicUtils(interaction, player);

    await interaction.deferReply();

    if (utils.check() || utils.checkQueue()) return;

    await player.stop();

    return interaction.editReply({
      embeds: [embed.setDescription("🔹 | Skipped.")],
    });
  },
};
