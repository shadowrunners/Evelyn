import { getAuditLog, send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { AuditLogEvent, EmbedBuilder, GuildChannel } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class ChannelUpdate {
	@On({ event: 'channelUpdate' })
	async channelUpdate(channels: GuildChannel, client: Evelyn) {
		const oldChannel = channels[0];
		const newChannel = channels[1];

		if (!(await validate(oldChannel.guild))) return;

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: oldChannel.guild.name,
				iconURL: oldChannel.guild.iconURL(),
			})
			.setTimestamp();

		const audit = await getAuditLog({
			type: AuditLogEvent.ChannelUpdate,
			guild: oldChannel.guild,
		});

		if (oldChannel.name !== newChannel.name)
			return await send({
				guild: oldChannel.guild,
				client,
				embed: embed.setTitle('Channel Name Updated').addFields(
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
						value: `> ${audit.executor}`,
					},
				),
			});

		if (oldChannel.type !== newChannel.type)
			return await send({
				guild: oldChannel.guild,
				client,
				embed: embed.setTitle('Channel Type Changed').addFields(
					{
						name: '🔹 | Channel',
						value: `> ${oldChannel}`,
					},
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
						value: `> ${audit.executor}`,
					},
				),
			});
	}
}
