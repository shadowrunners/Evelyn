const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const userBlacklist = require("../../../structures/schemas/userBlacklist.js");

module.exports = {
  subCommand: "blacklist-remove.user",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;
    const userId = options.getString("userid");
    const data = await userBlacklist.findOne({ userID: userId });

    if (data) {
      await data.deleteOne({ userID: userId });
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription(
              "🔹 | This user has been removed from the blacklist."
            )
            .setTimestamp(),
        ],
      });
    } else {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription("This user isn't blacklisted.")
            .setTimestamp(),
        ],
      });
    }
  },
};
