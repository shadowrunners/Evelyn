import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Role } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class RoleDelete {
	@On({ event: 'roleDelete' })
	async roleDelete(role: Role, client: Evelyn) {
		const { guild } = role;

		if (!(await validate(guild))) return;

		const logs = new OWLogs(guild, client);
		return await logs.roleCreate(role);
	}
}
