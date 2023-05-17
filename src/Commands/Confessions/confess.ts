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
import { webhookDelivery } from '../../Functions/webhookDelivery.js';

@Discord()
export class Confess {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple');
	}

	@Slash({ description: 'Send a confession', name: 'confess' })
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
	async confessionModal(interaction: ModalSubmitInteraction) {
		const { fields, guildId } = interaction;

		const [confession] = ['confession'].map((id) =>
			fields.getTextInputValue(id),
		);

		const data = await DB.findOne({
			id: guildId,
		});

		if (!data?.confessions?.enabled || !data?.confessions.webhook.id)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | Confessions are not enabled on this server or a channel for them hasn\'t been set yet.',
					),
				],
				ephemeral: true,
			});

		interaction.reply({
			embeds: [
				this.embed.setDescription(
					'🔹 | Your confession will be delivered shortly.',
				),
			],
			ephemeral: true,
		});

		return webhookDelivery(
			'confessions',
			data,
			this.embed
				.setTitle('A wild confession has appeared!')
				.setDescription(confession),
		);
	}
}
