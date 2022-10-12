const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const client = require("../structures/index.js");

module.exports = {
  id: "pause",
  /**
   * @param {ButtonInteraction} interaction
   */
  execute(interaction) {
    const player = client.manager.players.get(interaction.guild.id);

    if (!player) return;

    if (!player.paused) {
      player.pause(true);

      const pauseEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("🔹 | Paused.")
        .setFooter({
          text: `Action executed by ${interaction.user.username}.`,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp();
      return interaction.reply({ embeds: [pauseEmbed] });
    }

    if (player.paused) {
      player.pause(false);

      const resumeEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("🔹 | Resumed.")
        .setFooter({
          text: `Action executed by ${interaction.user.username}.`,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp();
      return interaction.reply({ embeds: [resumeEmbed] });
    }
  },
};
