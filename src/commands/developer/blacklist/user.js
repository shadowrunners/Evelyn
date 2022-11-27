const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const UB = require("../../../structures/schemas/userBlacklist.js");

module.exports = {
  subCommand: "blacklist.user",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;
    const userID = options.getString("userid");
    const blacklist_reason = options.getString("reason");
    const data = await UB.findOne({ userId: userID });

    if (data)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription("🔹 | This user is already blacklisted.")
            .setTimestamp(),
        ],
      });
    else {
      const newBlacklist = new UB({
        userID: userID,
        reason: blacklist_reason,
        time: Date.now(),
      });

      await newBlacklist.save();

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription("This user has been successfully blacklisted.")
            .addFields({ name: "🔹 | Reason", value: blacklist_reason })
            .setTimestamp(),
        ],
      });
    }
  },
};
