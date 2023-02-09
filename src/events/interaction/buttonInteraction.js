const { ButtonInteraction, Client, EmbedBuilder } = require('discord.js');
const { isBlacklisted } = require('../../functions/isBlacklisted.js');

module.exports = {
	name: 'interactionCreate',
	/**
	 * @param {ButtonInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { user, member } = interaction;
		if (!interaction.isButton()) return;

		const embed = new EmbedBuilder().setColor('Blurple');
		const button = client.buttons.get(interaction.customId);

		if (!button || button === undefined) return;
		if (await isBlacklisted(interaction)) return;

		if (
			button.permission &&
			!member.permissions.has(button.permission)
		) return interaction.reply({
			embeds: [
				embed.setDescription(
					'🔹 | You don\'t have the required permissions to use this button.',
				),
			],
			ephemeral: true,
		});


		if (button.developer && user.id !== client.config.ownerIDs) {
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | This button is only available to developers.',
					),
				],
				ephemeral: true,
			});
		};

		button.execute(interaction, client);
	},
};
