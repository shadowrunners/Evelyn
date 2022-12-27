const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const MusicUtils = require("../../../functions/musicUtils.js");
const client = require("../structures/index.js");

module.exports = {
  id: "pause",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { guildId, user } = interaction;

    const utils = new MusicUtils(interaction, player);
    const player = client.manager.players.get(guildId);
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTimestamp()
      .setFooter({
        text: `Action executed by ${user.username}.`,
        iconURL: user.avatarURL({ dynamic: true }),
      });

    if (utils.check()) return;

    await interaction.deferReply();

    if (!player.paused) {
      player.pause(true);
      return interaction.editReply({
        embeds: [embed.setDescription("🔹 | Paused.")],
      });
    }

    if (player.paused) {
      player.pause(false);

      return interaction.editReply({
        embeds: [embed.setDescription("🔹 | Resumed.")],
      });
    }
  },
};
