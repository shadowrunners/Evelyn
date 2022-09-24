const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const client = require("../structures/index.js");

module.exports = {
  id: "skip",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const player = client.manager.players.get(interaction.guild.id);
    if (!player) return;

    const skipEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`🔹 | Skipped.`)
      .setFooter({
        text: `Action executed by ${interaction.user.username}.`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await player.stop();

    return interaction.reply({ embeds: [skipEmbed] });
  },
};
