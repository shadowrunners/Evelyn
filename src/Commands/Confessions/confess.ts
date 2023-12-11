import { EmbedBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, ChatInputCommandInteraction, ModalSubmitInteraction } from 'discord.js';
import { webhookDelivery } from '@Helpers/sendWebhook.js';
import { Discord, Slash, ModalComponent } from 'discordx';
import { Guilds } from '@Schemas';
import { Evelyn } from '@Evelyn';

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
						.setStyle(TextInputStyle.Paragraph)
						.setRequired(true)
						.setMinLength(1),
				),
			);
		await interaction.showModal(modal);
	}

	@ModalComponent()
	async confessionModal(interaction: ModalSubmitInteraction, client: Evelyn) {
		const { fields, guildId } = interaction;
		const data = await Guilds.findOne({ id: guildId });
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

		await interaction.reply({
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
				.setTitle('Evelyn · Confessions')
				.setDescription(confession)
				.setTimestamp(),
		);
	}
}
