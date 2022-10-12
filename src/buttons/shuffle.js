const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const client = require("../structures/index.js");

module.exports = {
  id: "shuffle",
  /**
   * @param {ButtonInteraction} interaction
   */
  execute(interaction) {
    const player = client.manager.players.get(interaction.guild.id);

    if (!player) return;

    const noQueue = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription("🔹 | There is nothing in the queue.")
      .setTimestamp();

    const notPlaying = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription("🔹 | I'm not playing anything right now.")
      .setTimestamp();

    if (!player.playing)
      return interaction.reply({
        embeds: [notPlaying],
        ephemeral: true,
      });

    if (!player.queue.length)
      return interaction.reply({
        embeds: [noQueue],
        ephemeral: true,
      });

    const shuffleEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription("🔹 | Shuffled the queue.")
      .setFooter({
        text: `Action executed by ${interaction.user.username}.`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      })
      .setTimestamp();

    player.queue.shuffle();

    return interaction.reply({ embeds: [shuffleEmbed] });
  },
};
