const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const SB = require("../../../structures/schemas/serverBlacklist.js");

module.exports = {
  subCommand: "blacklist-remove.server",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;
    const guildID = options.getString("serverid");
    const data = await SB.findOne({ guildId: guildID });

    if (!data)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription("🔹 | This guild isn't blacklisted.")
            .setTimestamp(),
        ],
      });
    else {
      await data.deleteOne({ guildId: guildID });
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription(
              "🔹 | This guild has been removed from the blacklist."
            )
            .setTimestamp(),
        ],
      });
    }
  },
};
