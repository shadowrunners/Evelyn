const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const client = require("../structures/index.js");

module.exports = {
  id: "skip",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { guildId, user } = interaction;

    const player = client.manager.players.get(guildId);
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    if (!player) return;

    await interaction.deferReply();

    player.skip();

    return interaction.editReply({
      embeds: [
        embed.setDescription(`🔹 | Skipped.`).setFooter({
          text: `Action executed by ${user.username}.`,
          iconURL: user.avatarURL({ dynamic: true }),
        }),
      ],
    });
  },
};
