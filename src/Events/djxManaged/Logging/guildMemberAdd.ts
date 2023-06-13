import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Evelyn } from '../../../Evelyn.js';
import { GuildMember } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildMemberAdd {
	@On({ event: 'guildMemberAdd' })
	async guildMemberAdd([member]: [GuildMember], client: Evelyn) {
		const { guild } = member;

		if (!(await validate(guild))) return;
		const logs = new OWLogs(guild, client);

		return await logs.guildMemberAdd(member);
	}
}
