const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { check4Perms } = require("../../functions/utils.js");
const { isBlacklisted } = require("../../functions/isBlacklisted.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (await isBlacklisted(interaction)) return;

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
  },
};
