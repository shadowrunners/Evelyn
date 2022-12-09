const {
  UserContextMenuCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { isBlacklisted } = require("../../functions/isBlacklisted.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {UserContextMenuCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isUserContextMenuCommand()) return;

    const command = client.commands.get(interaction.commandName);
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (await isBlacklisted(interaction)) return;

    if (!command) {
      return interaction.reply({
        embeds: [embed.setDescription("This command is outdated.")],
      });
    } else return command.execute(interaction, client);
  },
};
