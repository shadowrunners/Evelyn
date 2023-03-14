import { Evelyn } from "../../structures/Evelyn";
import { Event } from "../../interfaces/interfaces";
import { ModalSubmitInteraction, EmbedBuilder } from "discord.js";
//const { isBlacklisted } = require('../../functions/isBlacklisted.js');

export const event: Event = {
    name: "interactionCreate",
    execute(interaction: ModalSubmitInteraction, client: Evelyn) {
        const { user, member } = interaction;
        if (!interaction.isModalSubmit()) return;

        const embed = new EmbedBuilder().setColor('Blurple');
        const modal = client.modals.get(interaction.customId);
        //if (await isBlacklisted(interaction)) return;

        if (!modal || modal === undefined) return;

        modal.execute(interaction, client);
    },
};