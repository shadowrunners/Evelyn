import { WebhookClient, EmbedBuilder } from 'discord.js';
import { pleaseDecryptMyData } from './secureStorage.js';
import { Evelyn } from '../Evelyn.js';

/** This function delivers the logs using Discord Webhooks. It exists as a separate dedicated function to avoid repeating code. */
export function webhookDelivery(
	type: string,
	data: any,
	embed: EmbedBuilder,
	client: Evelyn,
): void {
	// if (data?.type?.webhook !== Object) return;

	const handleWebhooks = () => {
		if (type === 'logs') {
			console.log('Type detected as logs!');
			const decryptedToken = pleaseDecryptMyData(
				data?.logs?.webhook.token,
				client,
			);

			console.log(`Decrypted webhook token: ${decryptedToken}`);

			const logsDropOff = new WebhookClient({
				id: data?.logs?.webhook?.id,
				token: decryptedToken,
			});

			console.log(`Created new logs drop off client: ${logsDropOff}`);

			return logsDropOff.send({
				embeds: [embed],
			});
		}

		if (type === 'confessions') {
			const decryptedToken = pleaseDecryptMyData(
				data?.confessions?.webhook.token,
				client,
			);

			const confessDropOff = new WebhookClient({
				id: data?.confessions?.webhook?.id,
				token: decryptedToken,
			});

			return confessDropOff.send({
				embeds: [embed],
			});
		}
	};

	if (type) handleWebhooks();
}
