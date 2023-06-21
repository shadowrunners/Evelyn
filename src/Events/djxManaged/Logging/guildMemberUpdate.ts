import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { GuildMember } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildMemberUpdate {
	@On({ event: 'guildMemberUpdate' })
	async guildMemberUpdate(members: GuildMember, client: Evelyn) {
		const oldMember = members[0];
		const newMember = members[1];

		if (!(await validate(newMember.guild))) return;
		const logs = new OWLogs(newMember.guild, client);

		return await logs.guildMemberUpdate(oldMember, newMember);
	}
}
