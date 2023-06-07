import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { GuildChannel, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class ChannelDelete {
	@On({ event: 'channelDelete' })
	async channelDelete([channel]: [GuildChannel], client: Evelyn) {
		const { guild, name, id } = channel;

		if (!validate(guild)) return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.ChannelDelete>({
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
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
			)
			.setTimestamp();

		return await dropOffLogs(guild, client, embed);
	}
}
