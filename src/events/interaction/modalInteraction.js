const { InteractionType, EmbedBuilder } = require("discord.js");
const { ModalSubmit } = InteractionType;

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.type !== ModalSubmit) return;

    const embed = new EmbedBuilder();
    const modal = client.modals.get(interaction.customId);

    if (!modal) return;
    if (modal == undefined) return;
    if (
      modal.permission &&
      !interaction.member.permissions.has(modal.permission)
    )
      return interaction.reply({
        embeds: [
          embed
            .setColor("Blurple")
            .setDescription(
              `🔹 | You don't have the required permissions to use this button.`
            )
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    if (modal.developer && interaction.user.id !== client.config.ownerIDs)
      return interaction.reply({
        embeds: [
          embed
            .setColor("Blurple")
            .setDescription("🔹 | This button is only available to developers.")
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    modal.execute(interaction, client);
  },
};
