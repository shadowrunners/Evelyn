import { Evelyn } from '../../structures/Evelyn.js';
import { Event } from '../../interfaces/interfaces.js';
import { ModalSubmitInteraction, EmbedBuilder } from 'discord.js';
// const { isBlacklisted } = require('../../functions/isBlacklisted.js');

const event: Event = {
	name: 'interactionCreate',
	execute(interaction: ModalSubmitInteraction, client: Evelyn) {
		if (!interaction.isModalSubmit()) return;

		const embed = new EmbedBuilder().setColor('Blurple');
		const modal = client.modals.get(interaction.customId);
		// if (await isBlacklisted(interaction)) return;

		if (!modal || modal === undefined) return;

		modal.execute(interaction, client);
	},
};

export default event;
