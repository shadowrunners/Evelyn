const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const DB = require("../structures/schemas/giveaway.js");

module.exports = {
  id: "joinGiveaway",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const embed = new EmbedBuilder();

    const data = await DB.findOne({
      id: interaction.guild.id,
      channel: interaction.channel.id,
      messageID: interaction.message.id,
    });

    if (!data) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | There is no data in the database.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.enteredUsers.includes(interaction.user.id)) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | You have already joined the giveaway.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.isPaused === true) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | This giveaway is currently paused.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.hasEnded === true) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | Unfortunately, this giveaway has ended.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await DB.findOneAndUpdate(
      {
        id: interaction.guild.id,
        channel: interaction.channel.id,
        messageID: interaction.message.id,
      },
      {
        $push: { Entered: interaction.user.id },
      }
    ).then(() => {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | Your entry has been confirmed. Good luck!")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    });
  },
};
