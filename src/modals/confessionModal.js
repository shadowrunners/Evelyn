// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, ModalSubmitInteraction } = require('discord.js');
const { webhookDelivery } = require('../functions/webhookDelivery.js');
const DB = require('../structures/schemas/guild.js');

module.exports = {
	id: 'confessionModal',
	/**
	 * @param {ModalSubmitInteraction} interaction
	 */
	async execute(interaction) {
		const { fields, guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const confession = fields.getTextInputValue('confession');

		const data = await DB.findOne({
			id: guildId,
		});

		if (!data?.confessions?.enabled || !data?.confessions.webhook.id)
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
			embed
				.setTitle('A wild confession has appeared!')
				.setDescription(confession)
				.setTimestamp(),
		);
	},
};
