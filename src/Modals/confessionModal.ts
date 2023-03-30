import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { webhookDelivery } from '../Functions/webhookDelivery.js';
import { GuildDB as DB } from '../structures/schemas/guild.js';
import { Modals } from '../Interfaces/interfaces.js';

const modal: Modals = {
	id: 'confessionModal',
	async execute(interaction: ModalSubmitInteraction) {
		const { fields, guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const confession = fields.getTextInputValue('confession');

		const data = await DB.findOne({
			id: guildId,
		});

		if (!data?.confessions?.enabled || !data?.confessions.webhook.id)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | Confessions are not enabled on this server or a channel for them hasn\'t been set yet.',
					),
				],
				ephemeral: true,
			});

		interaction.reply({
			embeds: [
				embed.setDescription('🔹 | Your confession will be delivered shortly.'),
			],
			ephemeral: true,
		});

		return webhookDelivery(
			'confessions',
			data,
			embed
				.setTitle('A wild confession has appeared!')
				.setDescription(confession)
				.setTimestamp(),
		);
	},
};

export default modal;
