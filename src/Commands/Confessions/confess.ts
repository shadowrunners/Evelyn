import {
	EmbedBuilder,
	ModalBuilder,
	TextInputStyle,
	ActionRowBuilder,
	TextInputBuilder,
	ChatInputCommandInteraction,
	ModalSubmitInteraction,
} from 'discord.js';
const { Paragraph } = TextInputStyle;
import { GuildDB as DB } from '../../Schemas/guild.js';
import { Discord, Slash, ModalComponent } from 'discordx';
import { webhookDelivery } from '../../Utils/Utils/webhookDelivery.js';
import { Evelyn } from '../../Evelyn.js';

@Discord()
export class Confess {
	@Slash({ name: 'confess', description: 'Send a confession' })
	async confess(interaction: ChatInputCommandInteraction): Promise<void> {
		const modal = new ModalBuilder()
			.setCustomId('confessionModal')
			.setTitle('Send a confession')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('confession')
						.setLabel('Confession')
						.setStyle(Paragraph)
						.setRequired(true)
						.setMinLength(1),
				),
			);
		await interaction.showModal(modal);
	}

	@ModalComponent()
	async confessionModal(interaction: ModalSubmitInteraction, client: Evelyn) {
		const { fields, guildId } = interaction;
		const data = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder().setColor('Blurple');
		const confession = fields.getTextInputValue('confession');

		if (!(data?.confessions?.enabled && data?.confessions.webhook.id))
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
			client,
			embed
				.setTitle('A wild confession has appeared!')
				.setDescription(confession)
				.setTimestamp(),
		);
	}
}
