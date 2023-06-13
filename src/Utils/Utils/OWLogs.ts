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
	ButtonStyle,
	EmbedBuilder,
	Guild,
	GuildBan,
	GuildChannel,
	GuildEmoji,
	GuildMember,
	Message,
	Role,
	WebhookClient,
} from 'discord.js';
import { Evelyn } from '../../Evelyn.js';

/**
 * Validates to see if the logging system is enabled and if the webhook exists.
 * @param guild The guild object
 * @returns {Promise<Boolean>} The boolean indicating if they are enabled or not.
 */
export async function validate(guild: Guild): Promise<boolean> {
	const data = await DB.findOne({
		id: guild.id,
	});

	if (!data?.logs?.enabled && !data?.logs?.webhook) return;

	return true;
}

/**
 * Extracts the unique role by filtering the arrays. Used to detect the role that has been removed.
 * @param guild The guild object.
 * @returns {string[]} An array of strings.
 */
function unique(arr1: string[], arr2: string[]): string[] {
	const unique1 = arr1.filter((z) => arr2.indexOf(z) === -1);
	const unique2 = arr2.filter((z) => arr1.indexOf(z) === -1);

	return unique1.concat(unique2);
}

/** The moderation logs system of Evelyn, an integral part of the Overwatch system. */
export class OWLogs {
	/** The guild object. */
	private guild: Guild;
	/** The client object. */
	private client: Evelyn;
	/** The embed object. */
	private embed: EmbedBuilder;

	/** Creates a new instance of the Overwatch Logs class. */
	constructor(guild: Guild, client: Evelyn) {
		// Replace this with a logger. So it's ✨ prettier ✨.
		// Should work for now though. :/
		if (!guild) return;

		this.guild = guild;
		this.client = client;
		this.embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: this.guild.name,
				iconURL: this.guild.iconURL(),
			})
			.setTimestamp();
	}

	/**
	 * Searches the server's audit log to retrieve information about who did what.
	 * @param type The type of event.
	 * @returns The latest audit log entry regarding the specified event.
	 */
	private async findAuditLog(type: AuditLogEvent) {
		const fetchLogs = await this.guild.fetchAuditLogs({
			type,
			limit: 1,
		});

		return fetchLogs.entries.first();
	}

	/**
	 * Delivers mod logs via Discord Webhooks.
	 * @param embed The embed object.
	 * @param components The components object used for Buttons and stuff.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	private async airDrop(
		embed: EmbedBuilder,
		components?: ActionRowBuilder<ButtonBuilder>,
	): Promise<APIMessage> {
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
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async channelCreate(channel: GuildChannel): Promise<APIMessage> {
		const { name, id } = channel;
		const firstLog = await this.findAuditLog(AuditLogEvent.ChannelCreate);

		return await this.airDrop(
			this.embed.setTitle('Channel Created').addFields(
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
	 * Handles the channelCreate event.
	 * @param channel The channel that was created.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async channelDelete(channel: GuildChannel): Promise<APIMessage> {
		const { name, id } = channel;
		const firstLog = await this.findAuditLog(AuditLogEvent.ChannelDelete);

		return await this.airDrop(
			this.embed.setTitle('Channel Deleted').addFields(
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

	/**
	 * Handles the channelUpdate event.
	 * @param oldChannel The old channel.
	 * @param newChannel The new channel.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async channelUpdate(
		oldChannel: GuildChannel,
		newChannel: GuildChannel,
	): Promise<APIMessage> {
		const firstLog = await this.findAuditLog(AuditLogEvent.ChannelUpdate);

		if (oldChannel.name !== newChannel.name)
			return await this.airDrop(
				this.embed.setTitle('Channel Name Updated').addFields(
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
				this.embed.setTitle('Channel Type Changed').addFields(
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

	/**
	 * Handles the emojiCreate event.
	 * @param emoji The emoji that was created.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async emojiCreate(emoji: GuildEmoji): Promise<APIMessage> {
		const { name, id } = emoji;
		const firstLog = await this.findAuditLog(AuditLogEvent.EmojiCreate);

		return await this.airDrop(
			this.embed.setTitle('Emoji Created').addFields(
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

	/**
	 * Handles the emojiDelete event.
	 * @param emoji The emoji that was deleted.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async emojiDelete(emoji: GuildEmoji): Promise<APIMessage> {
		const { name, id } = emoji;
		const firstLog = await this.findAuditLog(AuditLogEvent.EmojiDelete);

		return await this.airDrop(
			this.embed.setTitle('Emoji Deleted').addFields(
				{
					name: '🔹 | Emoji Name',
					value: `> ${name}`,
				},
				{
					name: '🔹 | Emoji ID',
					value: `> ${id}`,
				},
				{
					name: '🔹 | Removed by',
					value: `> <@${firstLog.executor.id}>`,
				},
			),
		);
	}

	/**
	 * Handles the emojiUpdate event.
	 * @param oldEmoji The old emoji.
	 * @param newEmoji The new emoji.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async emojiUpdate(
		oldEmoji: GuildEmoji,
		newEmoji: GuildEmoji,
	): Promise<APIMessage> {
		const firstLog = await this.findAuditLog(AuditLogEvent.EmojiUpdate);

		if (oldEmoji.name !== newEmoji.name)
			return await this.airDrop(
				this.embed.setTitle('Emoji Updated').addFields(
					{
						name: '🔹 | Old Name',
						value: `> ${oldEmoji.name}`,
					},
					{
						name: '🔹 | New Name',
						value: `> ${newEmoji.name}`,
					},
					{
						name: '🔹 | Updated by',
						value: `> <@${firstLog.executor.id}>`,
					},
				),
			);
	}

	/**
	 * Handles the guildBanAdd event.
	 * @param ban The ban object.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async guildBanAdd(ban: GuildBan): Promise<APIMessage> {
		const firstLog = await this.findAuditLog(AuditLogEvent.MemberBanAdd);
		const { user } = ban;

		return await this.airDrop(
			this.embed.setTitle('Member Banned').addFields(
				{
					name: '🔹 | Member Name',
					value: `> ${user.username}`,
				},
				{
					name: '🔹 | Member ID',
					value: `> ${user.id}`,
				},
				{
					name: '🔹 | Banned by',
					value: `> <@${firstLog.executor.id}>`,
				},
			),
		);
	}

	/**
	 * Handles the guildBanRemove event.
	 * @param ban The ban object.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async guildBanRemove(ban: GuildBan): Promise<APIMessage> {
		const firstLog = await this.findAuditLog(AuditLogEvent.MemberBanRemove);
		const { user } = ban;

		return await this.airDrop(
			this.embed.setTitle('Member Unbanned').addFields(
				{
					name: '🔹 | Member Name',
					value: `> ${user.username}`,
				},
				{
					name: '🔹 | Member ID',
					value: `> ${user.id}`,
				},
				{
					name: '🔹 | Unbanned by',
					value: `> <@${firstLog.executor.id}>`,
				},
			),
		);
	}

	/**
	 * Handles the guildMemberAdd event
	 * @param member The member object.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async guildMemberAdd(member: GuildMember): Promise<APIMessage> {
		const { user } = member;

		return await this.airDrop(
			this.embed.setTitle('Member Joined').addFields(
				{
					name: '🔹 | Member Name',
					value: `> ${user}`,
				},
				{
					name: '🔹 | Member ID',
					value: `> ${user.id}`,
				},
				{
					name: '🔹 | Account Age',
					value: `> <t:${parseInt(
						(user.createdTimestamp / 1000).toString(),
					)}:R>`,
				},
			),
		);
	}

	/**
	 * Handles the `guildMemberRemove` event.
	 * @param member The member object.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async guildMemberRemove(member: GuildMember): Promise<APIMessage> {
		const { user } = member;

		return await this.airDrop(
			this.embed.setTitle('Member Left').addFields(
				{
					name: '🔹 | Member Name',
					value: `> ${user}`,
				},
				{
					name: '🔹 | Member ID',
					value: `> ${user.id}`,
				},
				{
					name: '🔹 | Account Age',
					value: `> <t:${parseInt(
						(user.createdTimestamp / 1000).toString(),
					)}:R>`,
				},
			),
		);
	}

	/**
	 * Handles the `guildMemberUpdate` event.
	 * @param oldMember The old member.
	 * @param newMember The new member.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async guildMemberUpdate(
		oldMember: GuildMember,
		newMember: GuildMember,
	): Promise<APIMessage> {
		const oldRoles = oldMember.roles.cache.map((r) => r.id);
		const newRoles = newMember.roles.cache.map((r) => r.id);

		const embed = new EmbedBuilder().setColor('Blurple');

		if (oldRoles.length > newRoles.length) {
			const uniqueRoles = unique(oldRoles, newRoles);
			const role = this.guild.roles.cache.get(uniqueRoles[0].toString());

			return await this.airDrop(
				embed.setTitle('Member Roles Updated').addFields(
					{
						name: '🔹 | Member Username',
						value: `> ${oldMember.user.username}`,
					},
					{
						name: '🔹 | Member ID',
						value: `> ${oldMember.user.id}`,
					},
					{
						name: '🔹 | Removed Role',
						value: `> <@&${role.id}>`,
					},
				),
			);
		}

		if (oldRoles.length < newRoles.length) {
			const uniqueRoles = unique(oldRoles, newRoles);
			const role = this.guild.roles.cache.get(uniqueRoles[0].toString());

			return await this.airDrop(
				embed.setTitle('Member Roles Updated').addFields(
					{
						name: '🔹 | Member Username',
						value: `> ${oldMember.user.username}`,
					},
					{
						name: '🔹 | Member ID',
						value: `> ${oldMember.user.id}`,
					},
					{
						name: '🔹 | Added Role',
						value: `> <@&${role.id}>`,
					},
				),
			);
		}

		if (
			!oldMember.isCommunicationDisabled() &&
			newMember.isCommunicationDisabled()
		)
			return await this.airDrop(
				embed.setTitle('Member Timeout Applied').addFields(
					{
						name: '🔹 | Member Username',
						value: `> ${newMember.user.username}`,
					},
					{
						name: '🔹 | Member ID',
						value: `> ${newMember.user.id}`,
					},
					{
						name: '🔹 | Timeout expires',
						value: `> <t:${Math.floor(
							newMember.communicationDisabledUntilTimestamp / 1000,
						)}:R>`,
					},
				),
			);

		if (
			oldMember.isCommunicationDisabled() &&
			!newMember.isCommunicationDisabled()
		)
			return await this.airDrop(
				embed.setTitle('Member Timeout Removed').addFields(
					{
						name: '🔹 | Member Username',
						value: `> ${oldMember.user.username}`,
					},
					{
						name: '🔹 | Member ID',
						value: `> ${oldMember.user.id}`,
					},
					{
						name: '🔹 | Reason',
						value: '> Timeout expired!',
					},
				),
			);

		if (oldMember.nickname !== newMember.nickname)
			return await this.airDrop(
				embed.setTitle('Member Nickname Changed').addFields(
					{
						name: '🔹 | Username',
						value: `> ${newMember.user.username}`,
					},
					{
						name: '🔹 | ID',
						value: `> ${newMember.user.id}`,
					},
					{
						name: '🔹 | Old Nickname',
						value: `> ${oldMember.nickname}`,
					},
					{
						name: '🔹 | New Nickname',
						value: `> ${newMember.nickname}`,
					},
				),
			);
	}

	/**
	 * Handles the `messageCreate` event.
	 * @param message The message that was deleted.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async messageDelete(message: Message): Promise<APIMessage> {
		const { author, content, embeds, id } = message;
		const systemStatus = message.system === true || message.system === null;

		if (author?.bot || embeds?.length > 0 || systemStatus || content === null)
			return;

		const firstLog = await this.findAuditLog(AuditLogEvent.MemberBanRemove);

		return await this.airDrop(
			this.embed.setTitle('Message Deleted').addFields(
				{
					name: '🔹 | Message Content',
					value: `> ${content}`,
				},
				{
					name: '🔹 | ID',
					value: `> ${id}`,
				},
				{
					name: '🔹 | Message sent by',
					value: `> ${author}`,
				},
				{
					name: '🔹 | Deleted by',
					value: `> <@${firstLog?.executor.id}>`,
				},
			),
		);
	}

	/**
	 * Handles the `messageUpdate` event.
	 * @param oldMessage The old message.
	 * @param newMessage The new message.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async messageUpdate(
		oldMessage: Message,
		newMessage: Message,
	): Promise<APIMessage> {
		const embed = new EmbedBuilder().setColor('Blurple');
		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Jump to Message')
				.setStyle(ButtonStyle.Link)
				.setURL(oldMessage?.url),
		);

		if (oldMessage.content !== newMessage.content)
			return this.airDrop(
				embed.setTitle('Message Updated').addFields(
					{
						name: '🔹 | Old Content',
						value: `> ${oldMessage.content}`,
					},
					{
						name: '🔹 | New Content',
						value: `> ${newMessage.content}`,
					},
					{
						name: '🔹 | Message ID',
						value: `> ${oldMessage.id}`,
					},
					{
						name: '🔹 | Message updated by',
						value: `> ${newMessage.author}`,
					},
				),
				actionRow,
			);
	}

	/**
	 * Handles the `roleCreate` event.
	 * @param role The role that was created.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async roleCreate(role: Role): Promise<APIMessage> {
		const { name, hexColor, id } = role;
		const firstLog = await this.findAuditLog(AuditLogEvent.RoleCreate);

		return this.airDrop(
			this.embed.setTitle('Role Created').addFields(
				{
					name: '🔹 | Role Name',
					value: `> ${name}`,
				},
				{
					name: '🔹 | Role Color',
					value: `> ${hexColor}`,
				},
				{
					name: '🔹 | Role ID',
					value: `> ${id}`,
				},
				{
					name: '🔹 | Role created by',
					value: `> <@${firstLog.executor.id}>`,
				},
			),
		);
	}

	/**
	 * Handles the `roleDelete` event.
	 * @param role The role that was deleted.
	 * @returns {Promise<APIMessage>} The message that was sent via the webhook.
	 */
	public async roleDelete(role: Role): Promise<APIMessage> {
		const { name, id } = role;
		const firstLog = await this.findAuditLog(AuditLogEvent.RoleDelete);

		return this.airDrop(
			this.embed.setTitle('Role Deleted').addFields(
				{
					name: '🔹 | Role Name',
					value: `> ${name}`,
				},
				{
					name: '🔹 | Role ID',
					value: `> ${id}`,
				},
				{
					name: '🔹 | Role deleted by',
					value: `> <@${firstLog.executor.id}>`,
				},
			),
		);
	}
}
