import { getAuditLog, send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { AuditLogEvent, EmbedBuilder, Message } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class MessageDelete {
	@On({ event: 'messageDelete' })
	async messageDelete([message]: [Message], client: Evelyn) {
		if (message.partial) await message.fetch();
		if (!(await validate(message.guildId))) return;

		const { author, content, embeds, id } = message;
		const systemStatus = message.system === true || message.system === null;

		if (author?.bot || embeds?.length > 0 || systemStatus || content === null)
			return;

		const audit = await getAuditLog({
			type: AuditLogEvent.MessageDelete,
			guild: message.guild,
		});

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: message.guild.name,
				iconURL: message.guild.iconURL(),
			})
			.setTitle('Message Deleted')
			.addFields({
				name: '🔹 | Content',
				value: `> ${content}`,
			},
			{
				name: '🔹 | ID',
				value: `> ${id}`,
			},
			{
				name: '🔹 | Sent by',
				value: `> ${author}`,
			},
			{
				name: '🔹 | Deleted by',
				value: `> ${audit.executor}>`,
			},
			)
			.setTimestamp();

		return await send({
			guild: message.guildId,
			client,
			embed,
		});
	}
}
