const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const UB = require("../../../structures/schemas/userBlacklist.js");

module.exports = {
  subCommand: "blacklist-remove.user",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;
    const userID = options.getString("userid");
    const data = await UB.findOne({ userId: userID });
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (!data)
      return interaction.reply({
        embeds: [embed.setDescription("This user isn't blacklisted.")],
      });

    await data.deleteOne({ userId: userID });
    return interaction.reply({
      embeds: [
        embed.setDescription(
          "🔹 | This user has been removed from the blacklist."
        ),
      ],
    });
  },
};
