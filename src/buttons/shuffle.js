const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const MusicUtils = require("../functions/musicUtils.js");
const client = require("../structures/index.js");

module.exports = {
  id: "shuffle",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { guildId, user } = interaction;

    const player = client.manager.players.get(guildId);
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    const utils = new MusicUtils(interaction, player);

    await interaction.deferReply();

    if (utils.check()) return;

    player.queue.shuffle();

    return interaction.editReply({
      embeds: [
        embed.setDescription("🔹 | Shuffled the queue.").setFooter({
          text: `Action executed by ${user.username}.`,
          iconURL: user.avatarURL({ dynamic: true }),
        }),
      ],
    });
  },
};
