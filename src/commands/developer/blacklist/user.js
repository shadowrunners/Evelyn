const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const UB = require("../../../structures/schemas/userBlacklist.js");

module.exports = {
  subCommand: "blacklist.user",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;
    const userId = options.getString("userid");
    const blacklist_reason = options.getString("reason");
    const data = await UB.findOne({ userID: userId });
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (data)
      return interaction.reply({
        embeds: [
          embed.setDescription("🔹 | This user is already blacklisted."),
        ],
      });

    await UB.create({
      userID: userId,
      reason: blacklist_reason,
      time: Date.now(),
    });

    return interaction.reply({
      embeds: [
        embed.setDescription(
          `🔹 | This user has been successfully blacklisted for ${blacklist_reason}.`
        ),
      ],
    });
  },
};
