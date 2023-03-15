import {
	SlashCommandBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	ModalBuilder,
	TextInputStyle,
	ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
const { Paragraph } = TextInputStyle;

const command: Command = {
	data: new SlashCommandBuilder()
	.setName('confess')
	.setDescription('Send a confession.'),
	async execute(interaction: ChatInputCommandInteraction) {
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
	},
}

export default command;


