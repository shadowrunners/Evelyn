// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
	subCommand: 'tickets.configure',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options, guildId } = interaction;
		const category = options.getChannel('category');
		const transcripts = options.getChannel('transcripts');
		const assistantRole = options.getRole('assistant-role');
		const embed = new EmbedBuilder().setColor('Blurple');

		await GDB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'tickets.category': category.id,
					'tickets.transcripts': transcripts.id,
					'tickets.assistantRole': assistantRole.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setTitle('Configuration Updated').addFields(
					{
						name: '🔹 | Category',
						value: `> ${category.name}`,
					},
					{
						name: '🔹 | Transcripts Channel',
						value: `> <#${transcripts.id}>`,
					},
					{
						name: '🔹 | Assistant Role',
						value: `> <@&${assistantRole.id}>`,
					},
				),
			],
			ephemeral: true,
		});
	},
};
