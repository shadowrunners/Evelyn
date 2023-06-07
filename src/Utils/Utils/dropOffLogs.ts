import {
	Guild,
	APIMessage,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';
import { webhookDelivery } from './webhookDelivery.js';
import { Evelyn } from '../../Evelyn.js';

/**
 * Does a look-up to see if the guild has logging enabled.
 */
export async function validate(guild: Guild) {
	const data = await DB.findOne({
		id: guild.id,
	});

	if (!data?.logs?.enabled && !data?.logs?.webhook) return false;

	return true;
}

/**
 * A function that sends off logs via webhooks. Exists to reduce code repetition.
 * @param guild - The guild provided by the
 * @param embed - The embed that will be delivered.
 * @param client - The Evelyn class.
 */
export async function dropOffLogs(
	guild: Guild,
	client: Evelyn,
	embed: EmbedBuilder,
	components?: ActionRowBuilder<ButtonBuilder>,
): Promise<APIMessage> {
	const data = await DB.findOne({
		id: guild.id,
	});

	return webhookDelivery('logs', data, client, embed, components);
}
