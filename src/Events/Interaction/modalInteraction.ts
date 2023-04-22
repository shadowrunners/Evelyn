import { Evelyn } from '../../Structures/Evelyn';
import { Event } from '../../Interfaces/interfaces';
import {
	ModalSubmitInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from 'discord.js';
import { isBlacklisted } from '../../functions/isBlacklisted';

const event: Event = {
	name: 'interactionCreate',
	async execute(interaction: ModalSubmitInteraction, client: Evelyn) {
		const { user, customId } = interaction;
		if (!interaction.isModalSubmit()) return;

		const embed = new EmbedBuilder().setColor('Blurple');
		const modal = client.modals.get(customId);
		if (await isBlacklisted(interaction)) return;

		if (!modal ?? modal === undefined) return;

		if (modal.developer && !client.config.ownerIDs.includes(user.id))
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | This modal is only available to developers.',
					),
				],
			});

		return modal.execute(interaction, client);
	},
};

export default event;
