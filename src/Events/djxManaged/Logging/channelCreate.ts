import { getAuditLog, send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { AuditLogEvent, EmbedBuilder, GuildChannel } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class channelCreate {
    @On({ event: 'channelCreate' })
	async channelCreate([channel]: [GuildChannel], client: Evelyn) {
		if (channel.partial) await channel.fetch();
		if (!await validate(channel.guildId)) return;

		const audit = await getAuditLog({
			type: AuditLogEvent.ChannelCreate,
			guild: channel.guild,
		});

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: channel.guild.name,
				iconURL: channel.guild.iconURL(),
			})
			.setTitle('Channel Created')
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
					name: '🔹 | Created by',
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
