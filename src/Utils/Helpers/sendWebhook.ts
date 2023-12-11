import { WebhookClient, EmbedBuilder, APIMessage } from 'discord.js';
import { GuildInterface } from '@/Schemas/guild.js';
import { SecureStorage } from './secureStorage.js';
import { Evelyn } from '../../Evelyn.js';

/** This function delivers the logs using Discord Webhooks. It exists as a separate dedicated function to avoid repeating code. */
export function webhookDelivery(
	type: string,
	data: Partial<GuildInterface>,
	client: Evelyn,
	embed: EmbedBuilder,
): Promise<APIMessage> {
	const secureStorage = new SecureStorage();
	const handleWebhooks = () => {
		if (type === 'confessions') {
			const decryptedToken = secureStorage.decrypt(
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

	if (type) return handleWebhooks();
}
