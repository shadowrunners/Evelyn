const {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  subCommand: "giveaway.create",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const prize = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("giveaway-prize")
        .setLabel("Prize")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(256)
        .setRequired(true)
    );

    const winners = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("giveaway-winners")
        .setLabel("Winner Count")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    );

    const duration = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("giveaway-duration")
        .setLabel("Duration")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Example: 1 day")
        .setRequired(true)
    );

    const modal = new ModalBuilder()
      .setCustomId("createGiveaway")
      .setTitle("Create a Giveaway")
      .setComponents(prize, winners, duration);

    await interaction.showModal(modal);
  },
};
