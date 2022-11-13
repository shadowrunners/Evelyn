const { Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const { check4Perms } = require("../../utils/utils.js");
const {
  isUserBlacklisted,
  isServerBlacklisted,
} = require("../../utils/blacklistUtils.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const command = client.commands.get(interaction.commandName);
    if (
      interaction.isChatInputCommand() ||
      interaction.isUserContextMenuCommand()
    ) {
      const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

      if (await isUserBlacklisted(interaction)) return;
      if (await isServerBlacklisted(interaction)) return;

      if (!command) {
        return interaction.reply({
          embeds: [embed.setDescription("This command is outdated.")],
        });
      }

      if (command.botPermissions) {
        if (check4Perms(interaction, command)) return;
      }

      const subCommand = interaction.options.getSubcommand(false);
      if (subCommand) {
        const subCommandFile = client.subCommands.get(
          `${interaction.commandName}.${subCommand}`
        );

        if (!subCommandFile)
          return interaction.reply({
            embeds: [embed.setDescription("This subcommand is outdated.")],
            ephemeral: true,
          });

        subCommandFile.execute(interaction, client);
      } else command.execute(interaction, client);
    }
  },
};
