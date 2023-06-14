import { OWLogs, validate } from '../../../Utils/Utils/OWLogs.js';
import { Role } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class RoleCreate {
	@On({ event: 'roleCreate' })
	async roleCreate(role: Role, client: Evelyn) {
		const { guild } = role;

		if (!(await validate(guild))) return;

		const logs = new OWLogs(guild, client);
		return await logs.roleCreate(role);
	}
}
