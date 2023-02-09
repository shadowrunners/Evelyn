const { EmbedBuilder, ModalSubmitInteraction } = require("discord.js");
const { webhookDelivery } = require("../functions/webhookDelivery.js");
const DB = require("../structures/schemas/guild.js");

module.exports = {
    id: "confessionModal",
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        const { fields, guildId } = interaction;
        const embed = new EmbedBuilder().setColor("Blurple");
        const confession = fields.getTextInputValue("confession");

        const data = await DB.findOne({
            id: guildId,
        });

        interaction.reply({
            embeds: [
                embed.setDescription("🔹 | Your confession will be delivered shortly.")
            ],
            ephemeral: true,
        })

        return webhookDelivery(
            data,
            embed
                .setTitle("A wild confession has appeared!")
                .setDescription(confession)
        );
    },
};
