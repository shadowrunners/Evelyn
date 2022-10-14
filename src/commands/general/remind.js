const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Sets a reminder for you."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const whyRemind = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("whyRemind")
        .setLabel("What should I remind you of?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Example: Feed the dogs.")
        .setMaxLength(256)
        .setRequired(true)
    );

    const remindMeIn = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("remindMeIn")
        .setLabel("When should I remind you?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Example: 1 hour")
        .setMaxLength(256)
        .setRequired(true)
    );

    const modal = new ModalBuilder()
      .setCustomId("remind")
      .setTitle("Set a Reminder")
      .setComponents(whyRemind, remindMeIn);

    await interaction.showModal(modal);
  },
};
