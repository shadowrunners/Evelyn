const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const client = require("../structures/index.js");

module.exports = {
  id: "voldown",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const player = client.manager.players.get(interaction.guild.id);
    const volume = Number(player.volume) - 10;
    if (!player) return;

    const invalidVolume = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription("🔹| You can only set the volume from 0 to 100.")
      .setTimestamp();

    if (volume < 0 || volume > 100)
      return interaction.reply({
        embeds: [invalidVolume],
        ephemeral: true,
      });

    await player.setVolume(volume);

    const volUp = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`🔹 | Volume has been set to **${player.volume}%**.`)
      .setFooter({
        text: `Action executed by ${interaction.user.username}.`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      })
      .setTimestamp();
    return interaction.reply({ embeds: [volUp] });
  },
};
