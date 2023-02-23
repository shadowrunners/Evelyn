// eslint-disable-next-line no-unused-vars
const { WebhookClient, EmbedBuilder } = require('discord.js');

/**
 * This function delivers the logs using Discord Webhooks. It exists as a separate dedicated function to avoid repeating code.
 * @param {string} type - The type of the deliverer. Can be logs or confessions.
 * @param {object} data - The data object retrieved from the database.
 * @param {EmbedBuilder} embed - The embed object retrieved from the respective files where this is used.
 */

function webhookDelivery(type, data, embed) {
	if (data?.type?.webhook !== Object) return;

	switch (type) {
	case 'logs':
		// eslint-disable-next-line no-case-declarations
		const logsDropOff = new WebhookClient({
			id: data?.logs?.webhook?.id,
			token: data?.logs?.webhook?.token,
		});

		return logsDropOff.send({
			embeds: [embed],
		});

	case 'confessions':
		// eslint-disable-next-line no-case-declarations
		const confessDropOff = new WebhookClient({
			id: data?.confessions?.webhook?.id,
			token: data?.confessions?.webhook?.token,
		});

		return confessDropOff.send({
			embeds: [embed],
		});
	}
}

module.exports = { webhookDelivery };
