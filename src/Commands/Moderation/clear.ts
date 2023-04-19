import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';

const { ManageMessages } = PermissionFlagsBits;

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear a number of messages.')
		.setDefaultMemberPermissions(ManageMessages)
		.addNumberOption((options) =>
			options
				.setName('number')
				.setDescription('Provide the number of messages you\'d like to delete.')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, channel } = interaction;
		const messages = options.getNumber('number');
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
	},
};

export default command;
