const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const SB = require("../../../structures/schemas/serverBlacklist.js");

module.exports = {
  subCommand: "blacklist.server",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;
    const guildID = options.getString("serverid");
    const blacklist_reason = options.getString("reason");
    const data = await SB.findOne({ guildId: guildID });

    if (data)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription("This guild is already blacklisted.")
            .setTimestamp(),
        ],
      });
    else {
      const newBlacklist = new SB({
        guildId: guildID,
        reason: blacklist_reason,
        time: Date.now(),
      });

      await newBlacklist.save();

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription("This guild has been successfully blacklisted.")
            .addFields({ name: "🔹 | Reason", value: blacklist_reason })
            .setTimestamp(),
        ],
      });
    }
  },
};
