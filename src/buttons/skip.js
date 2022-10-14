const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const client = require("../structures/index.js");

module.exports = {
  id: "skip",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const player = client.manager.players.get(interaction.guild.id);
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    if (!player) return;

    await interaction.deferReply();

    embed.setDescription(`🔹 | Skipped.`).setFooter({
      text: `Action executed by ${interaction.user.username}.`,
      iconURL: interaction.user.avatarURL({ dynamic: true }),
    });

    player.skip();

    return interaction.editReply({ embeds: [embed] });
  },
};
