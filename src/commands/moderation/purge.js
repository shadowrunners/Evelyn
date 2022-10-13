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

    if (messages > 100 || messages < 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              "🔹 | You can't delete more than 100 messages or less than 1 message at once."
            )
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    await interaction.channel.bulkDelete(messages, true).then(() => {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Cleared ${messages} messages.`)
            .setTimestamp(),
        ],
      });
    });
  },
};
