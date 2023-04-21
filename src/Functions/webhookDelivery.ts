import { WebhookClient, EmbedBuilder } from 'discord.js';

/** This function delivers the logs using Discord Webhooks. It exists as a separate dedicated function to avoid repeating code. */
export function webhookDelivery(type: string, data: any, embed: EmbedBuilder) {
	if (data?.type?.webhook !== Object) return;

	const logsDropOff = new WebhookClient({
		id: data?.logs?.webhook?.id,
		token: data?.logs?.webhook?.token,
	});

	const confessDropOff = new WebhookClient({
		id: data?.confessions?.webhook?.id,
		token: data?.confessions?.webhook?.token,
	});

	switch (type) {
	case 'logs':
		return logsDropOff.send({
			embeds: [embed],
		});

	case 'confessions':
		return confessDropOff.send({
			embeds: [embed],
		});
	}
}
