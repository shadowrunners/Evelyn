const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const { checkForQueue, isSongPlaying } = require("../modules/musicModule.js");
const client = require("../structures/index.js");

module.exports = {
  id: "shuffle",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const player = client.manager.players.get(interaction.guild.id);
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (!player) return;
    if (
      isSongPlaying(interaction, player) ||
      checkForQueue(interaction, player)
    )
      return;

    await interaction.deferReply();

    embed.setDescription("🔹 | Shuffled the queue.").setFooter({
      text: `Action executed by ${interaction.user.username}.`,
      iconURL: interaction.user.avatarURL({ dynamic: true }),
    });

    player.queue.shuffle();

    return interaction.editReply({ embeds: [embed] });
  },
};
