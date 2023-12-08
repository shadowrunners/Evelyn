import { send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildMemberAdd {
	@On({ event: 'guildMemberAdd' })
	async guildMemberAdd([member]: [GuildMember], client: Evelyn) {
		if (!(await validate(member.guild.id))) return;

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: member.guild.name,
				iconURL: member.guild.iconURL(),
			})
			.setTitle('Member Joined')
			.addFields(
				{
					name: '🔹 | Member Name',
					value: `> ${member.displayName}`,
				},
				{
					name: '🔹 | Member ID',
					value: `> ${member.id}`,
				},
				{
					name: '🔹 | Account Age',
					value: `> <t:${parseInt(
						(member.user.createdTimestamp / 1000).toString(),
					)}:R>`,
				},
			)
			.setTimestamp();


		return await send({
			guild: member.guild.id,
			client,
			embed,
		});
	}
}
