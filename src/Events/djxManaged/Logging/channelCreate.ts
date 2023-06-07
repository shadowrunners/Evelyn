import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { GuildChannel, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class ChannelCreate {
	@On({ event: 'channelCreate' })
	async channelCreate([channel]: [GuildChannel], client: Evelyn) {
		const { guild, name, id } = channel;

		if (!(await validate(guild))) return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.ChannelCreate>({
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
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
			)
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
