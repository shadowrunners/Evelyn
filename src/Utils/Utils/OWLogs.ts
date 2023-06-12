/**
 * The moderation logs system of Evelyn, an integral part of the Overwatch system.
 * This class is here to reduce code repetition.
 */

import { pleaseDecryptMyData } from './secureStorage.js';
import { GuildDB as DB } from '../../Schemas/guild.js';
import {
	APIMessage,
	ActionRowBuilder,
	AuditLogEvent,
	ButtonBuilder,
	EmbedBuilder,
	Guild,
	GuildChannel,
	GuildEmoji,
	WebhookClient,
} from 'discord.js';
import { Evelyn } from '../../Evelyn.js';

export async function validate(guild: Guild) {
	const data = await DB.findOne({
		id: guild.id,
	});

	if (!data?.logs?.enabled && !data?.logs?.webhook) return false;

	return true;
}

export class OWLogs {
	private guild: Guild;
	private client: Evelyn;
	private embed: EmbedBuilder;

	constructor(guild: Guild, client: Evelyn) {
		// Replace this with a logger. So it's ✨ prettier ✨.
		// Should work for now though. :/
		if (!guild) return;

		this.guild = guild;
		this.client = client;
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	/** Searches the server's audit log to retrieve information about who did what. */
	private async findAuditLog(type: AuditLogEvent) {
		const fetchLogs = await this.guild.fetchAuditLogs({
			type,
			limit: 1,
		});

		return fetchLogs.entries.first();
	}

	/** Delivers mod logs via Discord Webhooks. */
	private async airDrop(
		embed: EmbedBuilder,
		components?: ActionRowBuilder<ButtonBuilder>,
	) {
		const data = await DB.findOne({
			id: this.guild.id,
		});

		if (!data?.logs?.webhook.token) return;

		const decryptedToken = pleaseDecryptMyData(
			data?.logs?.webhook.token,
			this.client,
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

	/**
	 * Handles the channelCreate event.
	 * @param channel The channel that was created.
	 * @returns {Promise<APIMessage>}
	 */
	public async channelCreate(channel: GuildChannel): Promise<APIMessage> {
		const { name, id } = channel;
		const firstLog = await this.findAuditLog(AuditLogEvent.ChannelCreate);

		return await this.airDrop(
			this.embed
				.setAuthor({
					name: this.guild.name,
					iconURL: this.guild.iconURL(),
				})
				.setTitle('Channel Created')
				.addFields(
					{
						name: '🔹 | Channel Name',
						value: `> ${name}`,
					},
					{
						name: '🔹 | ID',
						value: `> ${id}`,
					},
					{
						name: '🔹 | Created by',
						value: `> <@${firstLog.executor.id}>`,
					},
				),
		);
	}

	/**
	 * Handles the channelDelete event.
	 * @param channel The channel that was deleted.
	 * @returns {Promise<APIMessage>}
	 */
	public async channelDelete(channel: GuildChannel): Promise<APIMessage> {
		const { guild, name, id } = channel;
		const firstLog = await this.findAuditLog(AuditLogEvent.ChannelDelete);

		return await this.airDrop(
			this.embed
				.setAuthor({
					name: guild.name,
					iconURL: guild.iconURL(),
				})
				.setTitle('Channel Deleted')
				.addFields(
					{
						name: '🔹 | Channel Name',
						value: `> ${name}`,
					},
					{
						name: '🔹 | ID',
						value: `> ${id}`,
					},
					{
						name: '🔹 | Deleted by',
						value: `> <@${firstLog.executor.id}>`,
					},
				),
		);
	}

	public async channelUpdate(
		oldChannel: GuildChannel,
		newChannel: GuildChannel,
	) {
		const firstLog = await this.findAuditLog(AuditLogEvent.ChannelUpdate);

		if (oldChannel.name !== newChannel.name)
			return await this.airDrop(
				this.embed
					.setAuthor({
						name: this.guild.name,
						iconURL: this.guild.iconURL(),
					})
					.setTitle('Channel Name Updated')
					.addFields(
						{
							name: '🔹 | Old Channel Name',
							value: `> ${oldChannel.name}`,
						},
						{
							name: '🔹 | New Channel Name',
							value: `> ${newChannel.name}`,
						},
						{
							name: '🔹 | Updated by',
							value: `> <@${firstLog.executor.id}>`,
						},
					),
			);

		if (oldChannel.type !== newChannel.type)
			return await this.airDrop(
				this.embed
					.setAuthor({
						name: this.guild.name,
						iconURL: this.guild.iconURL(),
					})
					.setTitle('Channel Type Changed')
					.addFields(
						{
							name: '🔹 | Old Channel Type',
							value: `> ${oldChannel.type}`,
						},
						{
							name: '🔹 | New Channel Type',
							value: `> ${newChannel.type}`,
						},
						{
							name: '🔹 | Updated by',
							value: `> <@${firstLog.executor.id}>`,
						},
					),
			);
	}

	public async emojiCreate(emoji: GuildEmoji) {
		const { name, id } = emoji;
		const firstLog = await this.findAuditLog(AuditLogEvent.EmojiCreate);

		return await this.airDrop(
			this.embed
				.setAuthor({
					name: this.guild.name,
					iconURL: this.guild.iconURL(),
				})
				.setTitle('Emoji Created')
				.addFields(
					{
						name: '🔹 | Emoji Name',
						value: `> ${name}`,
					},
					{
						name: '🔹 | Emoji ID',
						value: `> ${id}`,
					},
					{
						name: '🔹 | Added by',
						value: `> <@${firstLog.executor.id}>`,
					},
				),
		);
	}

	public async emojiCreate(emoji: GuildEmoji) {
		const { name, id } = emoji;
		const firstLog = await this.findAuditLog(AuditLogEvent.EmojiCreate);

		return await this.airDrop(
			this.embed
				.setAuthor({
					name: this.guild.name,
					iconURL: this.guild.iconURL(),
				})
				.setTitle('Emoji Created')
				.addFields(
					{
						name: '🔹 | Emoji Name',
						value: `> ${name}`,
					},
					{
						name: '🔹 | Emoji ID',
						value: `> ${id}`,
					},
					{
						name: '🔹 | Added by',
						value: `> <@${firstLog.executor.id}>`,
					},
				),
		);
	}
}
