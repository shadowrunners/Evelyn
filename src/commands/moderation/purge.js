const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { ManageMessages } = PermissionsBitField.Flags;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a number of messages.")
    .setDefaultMemberPermissions(ManageMessages)
    .addStringOption((options) =>
      options
        .setName("number")
        .setDescription("Provide the number of messages you'd like to delete.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const messages = options.getString("number");

    if (number > 100)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              "🔹 | You can't delete more than 100 messages at once."
            )
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    if (number < 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              "🔹 | You can't delete less than 1 message at once."
            )
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    await interaction.channel.bulkDelete(number, true).then(() => {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Cleared ${number} messages.`)
            .setTimestamp(),
        ],
      });
    });
  },
};
