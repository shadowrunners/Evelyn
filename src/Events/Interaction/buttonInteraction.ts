import { Event } from '../../interfaces/interfaces.js';
import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../../structures/Evelyn.js';
import { Util } from '../../modules/Utils/utils.js';
import { isBlacklisted } from '../../functions/isBlacklisted.js';

const event: Event = {
	name: 'interactionCreate',
	async execute(interaction: ButtonInteraction, client: Evelyn) {
		const { user, member, customId } = interaction;
		if (!interaction.isButton()) return;

		const embed = new EmbedBuilder().setColor('Blurple');
		const button = client.buttons.get(customId);

		if (!button || button === undefined) return;
		if (await isBlacklisted(interaction)) return;

		// if (button.permission && !member.permissions.has(button.permission))
		//	return interaction.reply({
		//		embeds: [
		//			embed.setDescription(
		//				'🔹 | You don\'t have the required permissions to use this button.',
		//			),
		//		],
		//		ephemeral: true,
		//	});

		// if (button.developer && !user.id === client.config.ownerIDs) {
		// 	return interaction.reply({
		//		embeds: [
		//			embed.setDescription(
		//				'🔹 | This button is only available to developers.',
		//			),
		//		],
		//		ephemeral: true,
		//	});
		// }

		button.execute(interaction, client);
	},
};

export default event;
