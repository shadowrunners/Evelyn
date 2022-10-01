const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isButton()) {
      const Embed = new EmbedBuilder();
      const button = client.buttons.get(interaction.customId);

      if (!button) return;
      if (button == undefined) return;

      if (
        button.permission &&
        !interaction.member.permissions.has(button.permission)
      )
        return interaction.reply({
          embeds: [
            Embed.setColor("Blurple")
              .setDescription(
                "🔹 | You don't have the required permissions to use this button."
              )
              .setTimestamp(),
          ],
        });

      if (button.developer && interaction.user.id !== client.config.ownerIDs)
        return interaction.reply({
          embeds: [
            Embed.setColor("Blurple")
              .setDescription(
                "🔹 | This button is only available to developers."
              )
              .setTimestamp(),
          ],
        });

      button.execute(interaction, client);
    }
  },
};
