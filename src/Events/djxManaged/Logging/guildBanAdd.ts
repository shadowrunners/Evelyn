import { getAuditLog, send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { AuditLogEvent, EmbedBuilder, GuildBan } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildBanAdd {
	@On({ event: 'guildBanAdd' })
	async guildBanAdd([ban]: [GuildBan], client: Evelyn) {
		if (!(await validate(ban.guild.id))) return;

		const audit = await getAuditLog({
			type: AuditLogEvent.MemberBanAdd,
			guild: ban.guild,
		});

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: ban.guild.name,
				iconURL: ban.guild.iconURL(),
			})
			.setTitle('Member Banned')
			.addFields(
				{
					name: '🔹 | Member Name',
					value: `> ${ban.user.username}`,
				},
				{
					name: '🔹 | Member ID',
					value: `> ${ban.user.id}`,
				},
				{
					name: '🔹 | Banned by',
					value: `> ${audit.executor}`,
				},
			)
			.setTimestamp();


		return await send({
			guild: ban.guild.id,
			client,
			embed,
		});
	}
}
