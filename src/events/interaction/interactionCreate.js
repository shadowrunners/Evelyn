const { CommandInteraction, InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   */
  execute(interaction, client) {
    if (
      !interaction.type === InteractionType.ApplicationCommand ||
      !interaction.type === InteractionType.MessageComponent
    )
      return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({ content: "This command is outdated." });
    }

    command.execute(interaction, client);
  },
};
