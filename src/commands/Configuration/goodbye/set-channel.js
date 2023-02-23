const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
	subCommand: 'goodbye.set-channel',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options, guildId } = interaction;
		const channel = options.getChannel('channel');
		const embed = new EmbedBuilder().setColor('Blurple');

		await GDB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'goodbye.channel': channel.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, goodbye messages will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	},
};
