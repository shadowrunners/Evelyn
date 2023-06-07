import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { EmbedBuilder, AuditLogEvent, TextChannel } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class ChannelUpdate {
	@On({ event: 'channelUpdate' })
	async channelUpdate(channels: TextChannel, client: Evelyn) {
		const oldChannel = channels[0];
		const newChannel = channels[1];

		if (!(await validate(oldChannel.guild))) return;

		const fetchLogs =
			await oldChannel.guild.fetchAuditLogs<AuditLogEvent.ChannelUpdate>({
				limit: 1,
			});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder().setColor('Blurple');

		if (oldChannel.name !== newChannel.name)
			return await dropOffLogs(
				oldChannel.guild,
				client,
				embed
					.setAuthor({
						name: oldChannel.guild.name,
						iconURL: oldChannel.guild.iconURL(),
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
					)
					.setTimestamp(),
			);

		if (oldChannel.type !== newChannel.type)
			return await dropOffLogs(
				oldChannel.guild,
				client,
				embed
					.setAuthor({
						name: oldChannel.guild.name,
						iconURL: oldChannel.guild.iconURL(),
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
					)
					.setTimestamp(),
			);
	}
}
