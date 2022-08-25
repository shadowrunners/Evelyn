const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/giveaway.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "giveaway-join") return;

    const embed = new EmbedBuilder();
    const data = await DB.findOne({
      ID: interaction.guild.id,
      ChannelID: interaction.channel.id,
      MessageID: interaction.message.id,
    });

    if (!data) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | There is no data inside the database.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Entered.includes(interaction.user.id)) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | You have already joined the giveaway.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Paused === true) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | This giveaway is currently paused.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Ended === true) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | Unfortunately, this giveaway has ended.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await DB.findOneAndUpdate(
      {
        ID: interaction.guild.id,
        ChannelID: interaction.channel.id,
        MessageID: interaction.message.id,
      },
      {
        $push: { Entered: interaction.user.id },
      }
    ).then(() => {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | Entry registered. Good luck!")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    });
  },
};
