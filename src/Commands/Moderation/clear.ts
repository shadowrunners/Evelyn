import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	EmbedBuilder,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class Clear {
	@Slash({
		name: 'clear',
		description: 'Clear a number of messages.',
		defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
	})
	async clear(
		@SlashOption({
			name: 'messages',
			description: 'Provide the number of messages you\'d like to delete.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			messages: number,
			interaction: ChatInputCommandInteraction,
	) {
		const { channel } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (messages > 100 || messages < 1)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | You can\'t delete more than 100 messages or less than 1 message at once.',
					),
				],
				ephemeral: true,
			});

		await channel.bulkDelete(messages, true).then(() => {
			return interaction.reply({
				embeds: [embed.setDescription(`🔹 | Cleared ${messages} messages.`)],
			});
		});
	}
}
