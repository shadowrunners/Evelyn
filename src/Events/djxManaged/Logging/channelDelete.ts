import { getAuditLog, send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { AuditLogEvent, EmbedBuilder, GuildChannel } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class channelDelete {
	@On({ event: 'channelDelete' })
	async channelDelete([channel]: [GuildChannel], client: Evelyn) {
		if (channel.partial) await channel.fetch();
		if (!await validate(channel.guildId)) return;

		const audit = await getAuditLog({
			type: AuditLogEvent.ChannelDelete,
			guild: channel.guild,
		});

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: channel.guild.name,
				iconURL: channel.guild.iconURL(),
			})
			.setTitle('Channel Deleted')
			.addFields(
				{
					name: '🔹 | Channel Name',
					value: `> ${channel.name}`,
				},
				{
					name: '🔹 | ID',
					value: `> ${channel.id}`,
				},
				{
					name: '🔹 | Deleted by',
					value: `> ${audit.executor}`,
				},
			)
			.setTimestamp();

		return await send({
			guild: channel.guildId,
			client,
			embed,
		});
	}
}
