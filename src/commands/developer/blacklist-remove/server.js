const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const serverBlacklist = require("../../../structures/schemas/serverBlacklist.js");

module.exports = {
  subCommand: "blacklist-remove.server",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;
    const guildId = options.getString("serverid");
    const data = await serverBlacklist.findOne({ serverID: guildId });

    if (data) {
      await data.deleteOne({ serverID: guildId });
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
    } else {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Evelyn | Blacklist")
            .setDescription("🔹 | This guild isn't blacklisted.")
            .setTimestamp(),
        ],
      });
    }
  },
};
