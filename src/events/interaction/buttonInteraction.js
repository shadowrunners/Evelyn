const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");
const { isBlacklisted } = require("../../functions/isBlacklisted.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    const button = client.buttons.get(interaction.customId);

    if (!button || button === undefined) return;
    if (await isBlacklisted(interaction)) return;

    if (
      button.permission &&
      !interaction.member.permissions.has(button.permission)
    )
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🔹 | You don't have the required permissions to use this button."
          ),
        ],
      });

    if (button.developer && interaction.user.id !== client.config.ownerIDs)
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🔹 | This button is only available to developers."
          ),
        ],
      });

    button.execute(interaction, client);
  },
};
