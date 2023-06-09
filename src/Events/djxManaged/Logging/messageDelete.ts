import { dropOffLogs, validate } from '../../../Utils/Utils/dropOffLogs.js';
import { Message, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class MessageDelete {
	@On({ event: 'messageDelete' })
	async messageDelete([message]: [Message], client: Evelyn) {
		const { guild, author, content, embeds, id } = message;
		const systemStatus = message.system === true || message.system === null;

		if (
			author?.bot ||
			embeds?.length > 0 ||
			systemStatus ||
			content === null ||
			!(await validate(guild))
		)
			return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.MessageDelete>({
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
			})
			.setTitle('Message Deleted')
			.addFields(
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
			)
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
