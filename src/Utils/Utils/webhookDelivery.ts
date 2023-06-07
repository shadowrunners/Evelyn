import {
	WebhookClient,
	EmbedBuilder,
	APIMessage,
	ActionRowBuilder,
	ButtonBuilder,
} from 'discord.js';
import { pleaseDecryptMyData } from './secureStorage.js';
import { Evelyn } from '../../Evelyn.js';
import { GuildInterface } from '../../Schemas/guild.js';

/** This function delivers the logs using Discord Webhooks. It exists as a separate dedicated function to avoid repeating code. */
export function webhookDelivery(
	type: string,
	data: Partial<GuildInterface>,
	client: Evelyn,
	embed: EmbedBuilder,
	components?: ActionRowBuilder<ButtonBuilder>,
): Promise<APIMessage> {
	const handleWebhooks = () => {
		if (type === 'logs') {
			const decryptedToken = pleaseDecryptMyData(
				data?.logs?.webhook.token,
				client,
			);

			const logsDropOff = new WebhookClient({
				id: data?.logs?.webhook?.id,
				token: decryptedToken,
			});

			if (components?.components[0]?.data?.label === 'Jump to Message')
				return logsDropOff.send({
					embeds: [embed],
					components: [components],
				});
			else
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

	if (type) return handleWebhooks();
}
