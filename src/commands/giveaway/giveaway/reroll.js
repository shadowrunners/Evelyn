const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const {
  check4Data,
  check4Message,
  endGiveaway,
} = require("../../../functions/giveawayUtils.js");
const DB = require("../../../structures/schemas/giveaway.js");

module.exports = {
  subCommand: "giveaway.reroll",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { guild, options } = interaction;
    const messageId = options.getString("messageid");
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    const data = await DB.findOne({
      id: guild.id,
      messageID: messageId,
    });

    if (check4Data(data, interaction)) return;

    const message = await guild.channels?.cache
      .get(data?.channelId)
      ?.messages.fetch(messageId);

    if (check4Message(message, interaction)) return;

    const reroll = true;

    await endGiveaway(message, reroll).then(() => {
      embed.setDescription("🔹 | Giveaway has been successfully rerolled.");
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    });
  },
};
