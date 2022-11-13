const {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const { endGiveaway } = require("../../../utils/giveawayFunctions.js");
const DB = require("../../../structures/schemas/giveaway.js");

module.exports = {
  subCommand: "giveaway.manage",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { guild, options } = interaction;
    const embed = new EmbedBuilder();

    const messageId = options.getString("messageid");
    const toggle = options.getString("toggle");

    const data = await DB.findOne({
      id: guild.id,
      messageID: messageId,
    });

    if (!data) {
      embed
        .setColor("Blurple")
        .setDescription(
          "🔹 | There is no data in the database regarding that giveaway."
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const message = await guild.channels.cache
      .get(data.channel)
      .messages.fetch(messageId);

    if (!message) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | This giveaway doesn't exist.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (["end", "reroll"].includes(toggle)) {
      if (data.hasEnded === (toggle === "end" ? true : false)) {
        embed
          .setColor("Blurple")
          .setDescription(
            `🎉 This giveaway has ${
              toggle === "end" ? "already ended" : "not ended"
            }. 🎉`
          )
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (toggle === "end" && data.isPaused === true) {
        embed
          .setColor("Blurple")
          .setDescription(
            "This giveaway is currently paused. Unpause it before ending this giveaway."
          )
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      endGiveaway(message, toggle === "end" ? false : true);

      embed
        .setColor("Blurple")
        .setDescription(
          `🎉 The giveaway has **${
            toggle === "end" ? "ended" : "been rerolled"
          }**. 🎉`
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (["pause", "unpause"].includes(toggle)) {
      if (data.hasEnded) {
        embed
          .setColor("Blurple")
          .setDescription("🔹 | This giveaway has ended.")
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (data.isPaused === (toggle === "pause" ? true : false)) {
        embed
          .setColor("Blurple")
          .setDescription(
            `🎉 This giveaway is already ${
              toggle === "pause" ? "paused." : "unpaused."
            }`
          )
          .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const button = ActionRowBuilder.from(message.components[0]).setComponents(
        ButtonBuilder.from(message.components[0].components[0]).setDisabled(
          toggle === "pause" ? true : false
        )
      );

      const giveawayEmbed = EmbedBuilder.from(message.embeds[0]).setColor(
        toggle === "pause" ? "Yellow" : "#156789"
      );

      await DB.findOneAndUpdate(
        {
          id: interaction.guild.id,
          messageID: message.id,
        },
        { isPaused: toggle === "pause" ? true : false }
      );

      await message.edit({
        content: `🎉 **This giveaway is currently ${
          toggle === "pause" ? "paused" : "started"
        }** 🎉`,
        embeds: [giveawayEmbed],
        components: [button],
      });

      embed
        .setColor("Blurple")
        .setDescription(
          `🔹 | The giveaway has been ${
            toggle === "pause" ? "paused" : "unpaused"
          }.`
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed], ephemeral: true });

      if (toggle === "unpause" && data.endTime * 1000 < Date.now())
        endGiveaway(message);
    }

    if (toggle === "delete") {
      await DB.deleteOne({
        id: interaction.guild.id,
        messageID: message.id,
      });

      await message.delete();
      embed
        .setColor("Blurple")
        .setDescription("🔹 | This giveaway has been deleted.")
        .setTimestamp();
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
