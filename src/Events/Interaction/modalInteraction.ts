import { Evelyn } from '../../structures/Evelyn.js';
import { Event } from '../../interfaces/interfaces.js';
import { ModalSubmitInteraction, EmbedBuilder } from 'discord.js';
import { isBlacklisted } from '../../functions/isBlacklisted.js';

const event: Event = {
	name: 'interactionCreate',
	async execute(interaction: ModalSubmitInteraction, client: Evelyn) {
		if (!interaction.isModalSubmit()) return;

		const { guild } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');
		const modal = client.modals.get(interaction.customId);
		if (await isBlacklisted(interaction)) return;

		if (!modal || modal === undefined) return;

		if (
			modal.botPermissions &&
			!guild.members.me.permissions.has(modal.botPermissions)
		)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | You don\'t have the required permissions to use this button.',
					),
				],
				ephemeral: true,
			});

		modal.execute(interaction, client);
	},
};

export default event;
