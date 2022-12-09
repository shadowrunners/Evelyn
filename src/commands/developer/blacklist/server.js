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
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (data)
      return interaction.reply({
        embeds: [embed.setDescription("This guild is already blacklisted.")],
      });

    await SB.create({
      guildId: guildID,
      reason: blacklist_reason,
      time: Date.now(),
    });

    return interaction.reply({
      embeds: [
        embed.setDescription(
          `This guild has been successfully blacklisted for ${blacklist_reason}`
        ),
      ],
    });
  },
};
