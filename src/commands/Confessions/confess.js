const {
	SlashCommandBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	ModalBuilder,
	TextInputStyle,
} = require('discord.js');
const { Paragraph } = TextInputStyle;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confess')
		.setDescription('Send a confession.'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('confessionModal')
			.setTitle('Send a confession')
			.setComponents(
				new ActionRowBuilder().setComponents(
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
};
