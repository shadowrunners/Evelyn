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
    const { options, channel } = interaction;
    const messages = options.getString("number");
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (messages > 100 || messages < 1)
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🔹 | You can't delete more than 100 messages or less than 1 message at once."
          ),
        ],
        ephemeral: true,
      });

    await channel.bulkDelete(messages, true).then(() => {
      return interaction.reply({
        embeds: [embed.setDescription(`🔹 | Cleared ${messages} messages.`)],
      });
    });
  },
};
